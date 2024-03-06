
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


def convert_row(row):
    """Converts data types for each field and returns row with an error message if any conversion fails."""
    try:
        try:
            row['Sprintti'] = int(row['Sprintti'])
        except ValueError:
            return None, "Invalid format for field 'Sprintti'"
        
        try:
            row['Alkupvm'] = datetime.strptime(row['Alkupvm'], '%Y-%m-%d').date()
        except ValueError:
            return None, "Invalid format for field 'Alkupvm'"

        try:
            row['Loppupvm'] = datetime.strptime(row['Loppupvm'], '%Y-%m-%d').date()
        except ValueError:
            return None, "Invalid date format for field 'Loppupvm'"

        return row, None
    except Exception as e:
        return None, f"Unexpected error: {str(e)}"

def fetch_group_id(group_name):
    """Fetch the group ID from the 'groups' table based on the given group name."""

    try:
        conn, cur = connect_to_db()
        query = "SELECT id FROM groups WHERE name = %s"
        cur.execute(query, (group_name,))
        result = cur.fetchone()
        if result:
            return result[0], None
        else:
            return None, f"Group ID not found for group name {group_name}"
    except psycopg2.Error as e:
        return None, f"Error fetching the group ID: {e}"
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def insert_into_database(row, group_id):
    try:
        conn, cur = connect_to_db()
        now = datetime.now(timezone.utc)
        query = """
        INSERT INTO sprints (group_id, sprint, start_date, end_date, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cur.execute(query, (group_id, row['Sprintti'], row['Alkupvm'], row['Loppupvm'], now, now))
        conn.commit()
    except psycopg2.Error as e:
        return False, f"Database insertion error: {e}"
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def import_sprints_data(filepath):
    with open(filepath, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        invalid_rows = []
        successful_rows = 0

        for row in reader:
            conversion_success, error_conversion = convert_row(row)
            if conversion_success:
                group_id, error_group_id = fetch_group_id(row['Ryhmä'])
                if group_id:
                    insert_into_database(row, group_id)
                    successful_rows += 1
                else:
                    invalid_rows.append((row, error_group_id))
            else:
                invalid_rows.append((row, error_conversion))

        print(f"SUCCESSFUL ROWS: {successful_rows}\n")
        
        if invalid_rows:
            print("INVALID ROWS:\n")
            for row, error in invalid_rows:
                print(row)
                print(f"Error: {error}\n")


import_sprints_data('scripts/sprints.csv')
