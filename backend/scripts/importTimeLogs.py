
"""
A one-time use script for transferring data from CSV files into a database.

Required Python dependencies:
- psycopg2-binary
- python-dotenv
"""

import os
import csv
from datetime import datetime, timezone
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URI = os.getenv('DATABASE_URL')

def connect_to_db():
    try:
        conn = psycopg2.connect(DATABASE_URI)
        return conn, conn.cursor()
    except psycopg2.Error as e:
        print(f"Error connecting to the database: {e}")

def convert_hours_to_minutes(hours_str):
    try:
        hours_float = float(hours_str.replace(',', '.'))
        return int(hours_float * 60), None
    except ValueError:
        return None, f"Invalid hour format: {hours_str}"

def validate_and_format_date(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d'), None
    except ValueError:
        return None, f"Invalid date format: {date_str}"
    
def convert_sprint_to_int(sprint_str):
    try:
        return int(sprint_str), None
    except ValueError:
        return None, f"Invalid sprint format: {sprint_str}"


def fetch_group_id(student_number):
    if not student_number:
        return None, "Student number is empty"
    try:
        conn, cur = connect_to_db()
        query = "SELECT group_id FROM group_students WHERE user_student_number = %s"
        cur.execute(query, (student_number,))
        result = cur.fetchone()
        if result:
            return result[0], None
        else:
            return None, f"Group ID not found for student number {student_number}"
    except psycopg2.Error as e:
        return None, f"Error fetching the group ID: {e}"
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def fetch_sprint_id(group_id, sprint):

    """Fetch the sprint ID from the 'sprints' table based on the given group ID and start date."""

    conn, cur = connect_to_db()
    if conn is None or cur is None:
        return None, "Database connection error"
    
    try:
        query = "SELECT id FROM sprints WHERE group_id = %s AND sprint = %s"
        cur.execute(query, (group_id, sprint))
        result = cur.fetchone()
        if result:
            return result[0], None
        else:
            return None, "Sprint not found with the provided group ID and sprint number"
    except psycopg2.Error as e:
        return None, f"Error fetching the sprint ID: {e}"
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def add_time_log(date, minutes, description, student_number, sprint_id):

    """Add a new time log entry to the 'time_logs' table. Returns a tuple (success, error_message)"""
    
    conn, cur = connect_to_db()
    if conn is None or cur is None:
        return False, "Database connection error"
    
    created_at = datetime.now(timezone.utc)
    updated_at = datetime.now(timezone.utc)

    try:
        query = """
        INSERT INTO time_logs (date, minutes, description, student_number, sprint_id, created_at, updated_at) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cur.execute(query, (date, minutes, description, student_number, sprint_id, created_at, updated_at))
        conn.commit()
        return True, None
    except psycopg2.Error as e:
        return False, f"Error adding time log to the database: {e}"
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def main(filepath):
    with open(filepath, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        invalid_rows = []
        successful_rows = 0

        for row in reader:
            minutes, error_minutes = convert_hours_to_minutes(row['Tuntimäärä'])
            date, error_date = validate_and_format_date(row['Päivämäärä'])
            sprint, error_sprint = convert_sprint_to_int(row['Sprintti'])
            
            if error_minutes or error_date or error_sprint:
                error_message = error_minutes or error_date or error_sprint
                row['Error'] = error_message
                invalid_rows.append(row)
                continue
            
            group_id, error_group_id = fetch_group_id(row['Opiskelijanumero'])
            if not group_id:
                row['Error'] = error_group_id
                invalid_rows.append(row)
                continue

            sprint_id, error_sprint_id = fetch_sprint_id(group_id, sprint)
            if not sprint_id:
                row['Error'] = error_sprint_id
                invalid_rows.append(row)
                continue
            
            inserted_row, error_db = add_time_log(date, minutes, row['Tekstuaalinen kuvaus tehdystä työstä'], row['Opiskelijanumero'], sprint_id)
            if not inserted_row:
                row['Error'] = error_db
                invalid_rows.append(row)
                continue
            else:
                successful_rows += 1

        print(f"SUCCESSFUL ROWS: {successful_rows}\n")

        if invalid_rows:
            print("INVALID ROWS:\n")
            for row in invalid_rows:
                error_message = row.pop('Error') 
                print(row)
                print(f"Error: {error_message}\n") 
            



main('scripts/timelogs.csv')
