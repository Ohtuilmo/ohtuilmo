'use strict'

const initialQuestionsWithAnswers = [
  {
    type: 'info',
    header: 'Ohje',
    description:
      'Ohje: Anna avovastauksiin vapaamuotoiset perustelut arvosanaehdotuksille. Voit käyttää apuna vinkkeinä annettuna esimerkkejä asioista, joihin voi kiinnittää huomiota. Voit myös kertoa vapaasti muista mielestäsi olennaisista asioista. Arvioi jokainen ryhmäläinen. Kirjoita itseäsi koskevat perustelut erityisen huolellisesti. Huomaa, että saadakseen kurssista arvosanaksi 5 ei jokaisen osa-alueen tarvitse olla täydellinen. On luontevaa, että ryhmässä kontribuutioden painopisteet jakautuvat eri tavoin ja tämä on täysin ok myös tällä kurssilla. Myös annetun palautteen laatu vaikuttaa arvosanaan, eli tee arvostelu toisissasi ja perustele antamasi arviot.',
  },
  {
    type: 'number',
    header:
      'Aikaisempi kokemus ohjelmistokehitysprojekteista ja -työstä kuukausissa laskettuna',
    description: '',
  },
  {
    type: 'number',
    header: 'Kuinka monta tuntia käytit ohjelmistotuotantoprojektiin yhteensä?',
    description: '',
  },
  {
    type: 'radio',
    header:
      'Kuinka hyvin kukin ryhmän jäsen oli läsnä? Arvioi myös oma läsnäolosi.',
    options: [
      'En osaa sanoa',
      'Ei lainkaan',
      'Vähän',
      'Kohtuullisesti',
      'Paljon',
      'Erittäin paljon',
    ],
    description:
      '(Slackin ja muiden pikaviestimien aktiivinen käyttö lasketaan myös läsnäoloksi.)',
  },
  {
    type: 'number',
    header:
      'Kuinka monena päivänä viikossa teit työtä projektin eteen (keskimäärin).',
    description: '',
  },
  {
    type: 'peerReview',
    header: 'Tekninen kontribuutio',
    description:
      'Arvioi ryhmäläisten teknistä kontribuutiota. Kiinnitä huomioita ainakin seuraaviin: tehtyjen taskien määrä ja vaikeusaste, osallistuminen teknisten ratkaisujen suunnitteluun, tiimille tuotu lisäarvo tai erityisosaaminen, projektin aikana muodostuneet vastuualueet',
  },
  {
    type: 'radio',
    header: 'Tekninen  kontribuutio - arvosana',
    description:
      'Arvioi ryhmäläisten teknistä kontribuutiota. Kiinnitä huomioita ainakin seuraaviin:; tehtyjentaskien määrä, vaikeusaste; osallistumisesi teknisten ratkaisujen suunnitteluun; tiimilletuomasi lisäarvo tai erityisosaaminen; projektin aikana muodostuneet vastuualueet',
  },
  {
    type: 'radio',
    header: 'Noudattiko ryhmäläisesi sovittuja aikatauluja?',
    options: [
      'En osaa sanoa',
      'Ei lainkaan',
      'Hieman',
      'Kohtuullisen hyvin',
      'Hyvin',
      'Erinomaisesti',
    ],
    description:
      'Missä määrin kukin ryhmän jäsen oli valmis oppimaan projektin aikana itselleen uusia asioita/tekniikoita',
  },
  {
    type: 'peerReview',
    header: 'Prosessin noudattaminen',
    description:
      'Scrum-tiimi sopii keskenään noudattamistaan työtavoista. Kuinka hyvin noudatit niitä? Kiinnitä huomiota ainakin seuraaviin: Tekemisen läpinäkyvyys, Osallistuminen dailyihin,  Product ja Sprint backlogin käyttö, DoD noudattaminen, Keskittyminen asioihin prioriteettijärjestyksessä, Tuntikirjanpidon ajantasaisuus, Aktiivisuus sprint planningissä',
  },
  {
    type: 'radio',
    header: 'Prosessin noudattaminen - arvosana',
    description:
      'Arvosana edellisestä osa-alueesta. Perustaso on arvosana 3. Sitä alempi arvosana tarkoittaa ryhmän toiminnan häiritsemistä tai hidastamista. Mikäli edellisessä kohdassa on positiivisia huomioita, arvosana voi olla korkeampi. Huomaa kuitenkin että nämä eivät suoraan ole kurssiarvosanoja.',
  },
  {
    type: 'peerReview',
    header: 'Prosessin kehittäminen',
    description:
      'Toiminnan jatkuva kehittäinen (Inspect ja Adapt) on Scrumin perusperiaate. Kerro miten kukin ryhmäläinen osallistui tiimisi työskentely prosessin parantamiseen. Kiinnitä huomioita ainakin seuraaviin: Havaitut ongelmakohdat, Ongelmien esille tuominen esim retroissa, Ratkaisujen kehittäminen ongelmiin. Esim. backlog refinement, asiakaspalavereiden valmistautumiset, branching-käytännöt, user storyjen parantaminen, jne',
  },
  {
    type: 'radio',
    header: 'Prosessin kehittäminen - arvosana',
    description:
      'Arvosana edellisestä osa-alueesta. Perustaso on arvosana 3. Sitä alempi arvosana tarkoittaa ryhmän toiminnan häiritsemistä tai hidastamista. Mikäli edellisessä kohdassa on positiivisia huomioita, arvosana voi olla korkeampi. Huomaa kuitenkin että nämä eivät suoraan ole kurssiarvosanoja.',
  },
  {
    type: 'peerReview',
    header: 'Ryhmätyö',
    description:
      'Kaikki ryhmätyöskentelyn aspektit eivät ole prosessin noudattamista tai kehittämistä. Tässä voit arvioida esim seuraavia asioita, Kyky koordinoida oma toiminta muiden kanssa, Luotettavuus, täsmällisyys, On paikalla kun on sovittu, Ilmoittaa ajoissa poikkeukset, Saa kiinni työaikojen sisällä, jos on etänä, Muiden auttaminen työnteossa; ei keskity vain omaan suoritukseen, Eri asioiden monipuolinen osaaminen tai yrittäminen (vs. siiloutuminen), Yhteisen työskentelyn mielekkääksi tekeminen, ryhmähengen ylläpito',
  },
  {
    type: 'radio',
    header: 'Ryhmätyö - arvosana',
    description:
      'Arvosana edellisestä osa-alueesta. Perustaso on arvosana 3. Sitä alempi arvosana tarkoittaa ryhmän toiminnan häiritsemistä tai hidastamista. Mikäli edellisessä kohdassa on positiivisia huomioita, arvosana voi olla korkeampi. Huomaa kuitenkin että nämä eivät suoraan ole kurssiarvosanoja.',
  },
  {
    type: 'radio',
    header:
      'Miten innokkaasti kukin ryhmän jäsen osallistui projektin eteenpäinviemiseen? Arvioi myös oma innokkuutesi.',
    options: [
      'En osaa sanoa',
      'Ei lainkaan',
      'Hieman',
      'Kohtuullisen hyvin',
      'Hyvin',
      'Erinomaisesti',
    ],
    description:
      'innokkuus: positiivinen tunne ja toiminta jonkun projektin osa-alueen eteenpäin viemisessä',
  },
  {
    type: 'peerReview',
    header: 'Asiakastyöskentely',
    description:
      'Tärkeä osa scrum tiimin tekemistä on toimiminen asiakkaan kanssa. Kuinka hyvin kukin ryhmäläinen myötävaikutti asiakkaan kanssa työskentelyn onnistumiseen., demojen valmistelu, demojen sujuvuus, asiallinen käytös, täsmällisyys, kommunikointi, agendan laatiminen, muistiinpanojen tekeminen, user storyjen muodostaminen asiakkaan toiveista, väli- ja loppudemoon valmistautuminen',
  },
  {
    type: 'radio',
    header: 'Asiakastyöskentely - arvosana',
    description:
      'Arvosana edellisestä osa-alueesta. Perustaso on arvosana 3. Sitä alempi arvosana tarkoittaa ryhmän toiminnan häiritsemistä tai hidastamista. Mikäli edellisessä kohdassa on positiivisia huomioita, arvosana voi olla korkeampi. Huomaa kuitenkin että nämä eivät suoraan ole kurssiarvosanoja.',
  },
  {
    type: 'radio',
    header: 'Arvosanaehdotuksesi',
    description: '',
  },
]

const initialReviewQuestionSet = [
  {
    name: 'Review 2',
    questions: JSON.stringify(
      initialQuestionsWithAnswers.map((item) => {
        return {
          header: item.header,
          description: item.description,
          type: item.type,
          options: item.options,
        }
      })
    ),
  },
]

const initialPeerReviewAnswers1 = [
  {
    id: 0,
    type: 'info',
    header: 'Ohje',
    description:
      'Ohje: Anna avovastauksiin vapaamuotoiset perustelut arvosanaehdotuksille. Voit käyttää apuna vinkkeinä annettuna esimerkkejä asioista, joihin voi kiinnittää huomiota. Voit myös kertoa vapaasti muista mielestäsi olennaisista asioista. Arvioi jokainen ryhmäläinen. Kirjoita itseäsi koskevat perustelut erityisen huolellisesti. Huomaa, että saadakseen kurssista arvosanaksi 5 ei jokaisen osa-alueen tarvitse olla täydellinen. On luontevaa, että ryhmässä kontribuutioden painopisteet jakautuvat eri tavoin ja tämä on täysin ok myös tällä kurssilla. Myös annetun palautteen laatu vaikuttaa arvosanaan, eli tee arvostelu toisissasi ja perustele antamasi arviot.',
  },
  {
    id: 1,
    type: 'number',
    answer: '24',
    questionHeader:
      'Aikaisempi kokemus ohjelmistokehitysprojekteista ja -työstä kuukausissa laskettuna',
  },
  {
    id: 2,
    type: 'number',
    answer: '160',
    questionHeader:
      'Kuinka monta tuntia käytit ohjelmistotuotantoprojektiin yhteensä?',
  },
  {
    id: 3,
    type: 'radio',
    peers: { 'New User': 2, 'John Smith': 3, 'Jane Madison': 4 },
    questionHeader:
      'Kuinka hyvin kukin ryhmän jäsen oli läsnä? Arvioi myös oma läsnäolosi.',
  },
  {
    id: 4,
    type: 'number',
    answer: '4',
    questionHeader:
      'Kuinka monena päivänä viikossa teit työtä projektin eteen (keskimäärin).',
  },
  {
    id: 5,
    type: 'peerReview',
    peers: {
      'New User':
        'Aktiivinen osallistuminen teknisen suunnittelun kaikissa vaiheissa.',
      'John Smith':
        'Vastuullinen tehtävien hallinnassa, erinomainen erityisosaaminen. (itsearvio)',
      'Jane Madison': 'Tehokas vastuualueiden hoito ja ongelmien ratkaisu.',
    },
    questionHeader: 'Tekninen kontribuutio',
  },
  {
    id: 6,
    type: 'radio',
    peers: { 'New User': 3, 'John Smith': 3, 'Jane Madison': 4 },
    questionHeader: 'Tekninen  kontribuutio - arvosana',
  },
  {
    id: 7,
    type: 'radio',
    peers: { 'New User': 1, 'John Smith': 3, 'Jane Madison': 1 },
    questionHeader: 'Noudattiko ryhmäläisesi sovittuja aikatauluja?',
  },
  {
    id: 8,
    type: 'peerReview',
    peers: {
      'New User':
        'Hyvin noudatettu prosesseja ja aktiivinen osallistuminen päivittäisiin kokouksiin.',
      'John Smith':
        'Erinomainen läpinäkyvyys ja DoD:n noudattaminen. (itsearvio)',
      'Jane Madison':
        'Aktiivinen sprint planningissä ja hyvä käyttö backlogille.',
    },
    questionHeader: 'Prosessin noudattaminen',
  },
  {
    id: 9,
    type: 'radio',
    peers: { 'New User': 4, 'John Smith': 3, 'Jane Madison': 4 },
    questionHeader: 'Prosessin noudattaminen - arvosana',
  },
  {
    id: 10,
    type: 'peerReview',
    peers: {
      'New User':
        'Proaktiivinen ongelmien tunnistamisessa ja ratkaisujen kehittämisessä.',
      'John Smith':
        'Aktiivinen osallistuminen retroissa ja prosessien parantamisessa. (itsearvio)',
      'Jane Madison':
        'Jatkuvasti parannettu user storyjen laatua ja asiakaspalavereihin valmistautumista.',
    },
    questionHeader: 'Prosessin kehittäminen',
  },
  {
    id: 11,
    type: 'radio',
    peers: { 'New User': 2, 'John Smith': 3, 'Jane Madison': 4 },
    questionHeader: 'Prosessin kehittäminen - arvosana',
  },
  {
    id: 12,
    type: 'peerReview',
    peers: {
      'New User':
        'Loistava kyky koordinoida toimintaa muiden kanssa ja tukea tiimiä.',
      'John Smith':
        'Luotettava, täsmällinen ja hyvä ryhmähengen ylläpitäjä. (itsearvio)',
      'Jane Madison': 'Monipuoliset taidot ja aktiivinen auttaminen tiimille.',
    },
    questionHeader: 'Ryhmätyö',
  },
  {
    id: 13,
    type: 'radio',
    peers: { 'New User': 2, 'John Smith': 1, 'Jane Madison': 4 },
    questionHeader: 'Ryhmätyö - arvosana',
  },
  {
    id: 14,
    type: 'radio',
    peers: { 'New User': 2, 'John Smith': 3, 'Jane Madison': 4 },
    questionHeader:
      'Miten innokkaasti kukin ryhmän jäsen osallistui projektin eteenpäinviemiseen? Arvioi myös oma innokkuutesi.',
  },
  {
    id: 15,
    type: 'peerReview',
    peers: {
      'New User':
        'Erinomainen demojen valmistelu ja sujuva kommunikointi asiakkaan kanssa.',
      'John Smith':
        'Asiallinen käytös ja täsmällisyys demoissa ja palavereissa. (itsearvio)',
      'Jane Madison':
        'Aktiivinen osallistuminen user storyjen muodostamiseen ja demojen sujuvuuteen.',
    },
    questionHeader: 'Asiakastyöskentely',
  },
  {
    id: 16,
    type: 'radio',
    peers: { 'New User': 3, 'John Smith': 3, 'Jane Madison': 3 },
    questionHeader: 'Asiakastyöskentely - arvosana',
  },
  {
    id: 17,
    type: 'radio',
    peers: { 'New User': 3, 'John Smith': 1, 'Jane Madison': 2 },
    questionHeader: 'Arvosanaehdotuksesi',
  },
]

const initialPeerReviewAnswers2 = [
  {
    id: 0,
    type: 'info',
    header: 'Ohje',
    description:
      'Ohje: Anna avovastauksiin vapaamuotoiset perustelut arvosanaehdotuksille. Voit käyttää apuna vinkkeinä annettuna esimerkkejä asioista, joihin voi kiinnittää huomiota. Voit myös kertoa vapaasti muista mielestäsi olennaisista asioista. Arvioi jokainen ryhmäläinen. Kirjoita itseäsi koskevat perustelut erityisen huolellisesti. Huomaa, että saadakseen kurssista arvosanaksi 5 ei jokaisen osa-alueen tarvitse olla täydellinen. On luontevaa, että ryhmässä kontribuutioden painopisteet jakautuvat eri tavoin ja tämä on täysin ok myös tällä kurssilla. Myös annetun palautteen laatu vaikuttaa arvosanaan, eli tee arvostelu toisissasi ja perustele antamasi arviot.',
  },
  {
    id: 1,
    type: 'number',
    answer: '2',
    questionHeader:
      'Aikaisempi kokemus ohjelmistokehitysprojekteista ja -työstä kuukausissa laskettuna',
  },
  {
    id: 2,
    type: 'number',
    answer: '124',
    questionHeader:
      'Kuinka monta tuntia käytit ohjelmistotuotantoprojektiin yhteensä?',
  },
  {
    id: 3,
    type: 'radio',
    peers: { 'New User': 1, 'John Smith': 3, 'Jane Madison': 1 },
    questionHeader:
      'Kuinka hyvin kukin ryhmän jäsen oli läsnä? Arvioi myös oma läsnäolosi.',
  },
  {
    id: 4,
    type: 'number',
    answer: '2',
    questionHeader:
      'Kuinka monena päivänä viikossa teit työtä projektin eteen (keskimäärin).',
  },
  {
    id: 5,
    type: 'peerReview',
    peers: {
      'New User': 'Ihan ok tekninen kontribuutio, mutta voisi olla enemmän.',
      'John Smith':
        'Jatkuvasti parantanut osaamistaan ja tuonut lisäarvoa tiimille.',
      'Jane Madison':
        'Erinomainen tekninen osaaminen ja vastuualueiden hoito. (itsearvio)',
    },
    questionHeader: 'Tekninen kontribuutio',
  },
  {
    id: 6,
    type: 'radio',
    peers: { 'New User': 2, 'John Smith': 3, 'Jane Madison': 4 },
    questionHeader: 'Tekninen  kontribuutio - arvosana',
  },
  {
    id: 7,
    type: 'radio',
    peers: { 'New User': 4, 'John Smith': 4, 'Jane Madison': 1 },
    questionHeader: 'Noudattiko ryhmäläisesi sovittuja aikatauluja?',
  },
  {
    id: 8,
    type: 'peerReview',
    peers: {
      'New User':
        'on ollut aktiivinen ja vastuullinen prosessien noudattamisessa.',
      'John Smith':
        'on ollut erinomainen esimerkki muille prosessien noudattamisessa.',
      'Jane Madison': 'ihan jees (itsearvio)',
    },
    questionHeader: 'Prosessin noudattaminen',
  },
  {
    id: 9,
    type: 'radio',
    peers: { 'New User': 3, 'John Smith': 3, 'Jane Madison': 4 },
    questionHeader: 'Prosessin noudattaminen - arvosana',
  },
  {
    id: 10,
    type: 'peerReview',
    peers: {
      'New User':
        'juuri sopivasti osallistunut prosessien kehittämiseen ja parantanut niitä.',
      'John Smith': 'ihanaa että on ollut mukana prosessien kehittämisessä.',
      'Jane Madison':
        'on ollut aktiivinen ja tehnyt paljon töitä prosessien parantamiseksi. (itsearvio)',
    },
    questionHeader: 'Prosessin kehittäminen',
  },
  {
    id: 11,
    type: 'radio',
    peers: { 'New User': 3, 'John Smith': 3, 'Jane Madison': 5 },
    questionHeader: 'Prosessin kehittäminen - arvosana',
  },
  {
    id: 12,
    type: 'peerReview',
    peers: {
      'New User':
        'on ollut mukava ja ystävällinen ryhmätyöskentelyssä ja tukenut muita.',
      'John Smith': 'ihan jees ryhmätyöskentelyssä ja tukenut muita.',
      'Jane Madison':
        'kiva tyyppi ja tukenut muita ryhmätyöskentelyssä. (itsearvio)',
    },
    questionHeader: 'Ryhmätyö',
  },
  {
    id: 13,
    type: 'radio',
    peers: { 'New User': 4, 'John Smith': 1, 'Jane Madison': 2 },
    questionHeader: 'Ryhmätyö - arvosana',
  },
  {
    id: 14,
    type: 'radio',
    peers: { 'New User': 3, 'John Smith': 3, 'Jane Madison': 2 },
    questionHeader:
      'Miten innokkaasti kukin ryhmän jäsen osallistui projektin eteenpäinviemiseen? Arvioi myös oma innokkuutesi.',
  },
  {
    id: 15,
    type: 'peerReview',
    peers: {
      'New User':
        'kyllä on ollut mukana asiakastyöskentelyssä ja tukenut muita.',
      'John Smith':
        'ei ole ollut mukana asiakastyöskentelyssä ja tukenut muita.',
      'Jane Madison':
        'jaa-a, on ollut mukana asiakastyöskentelyssä ja tukenut muita. (itsearvio)',
    },
    questionHeader: 'Asiakastyöskentely',
  },
  {
    id: 16,
    type: 'radio',
    peers: { 'New User': 4, 'John Smith': 2, 'Jane Madison': 3 },
    questionHeader: 'Asiakastyöskentely - arvosana',
  },
  {
    id: 17,
    type: 'radio',
    peers: { 'New User': 4, 'John Smith': 2, 'Jane Madison': 3 },
    questionHeader: 'Arvosanaehdotuksesi',
  },
]

const InitialPeerReview = [
  {
    user_id: 112345701,
    configuration_id: 1,
    review_round: 2,
    answer_sheet: JSON.stringify(initialPeerReviewAnswers1), // john smith
  },
  {
    user_id: 112345702,
    configuration_id: 1,
    review_round: 2,
    answer_sheet: JSON.stringify(initialPeerReviewAnswers2), // jane madison
  },
]

const addTimeStamps = (arr) => {
  return arr.map((item) => {
    return {
      ...item,
      created_at: new Date(),
      updated_at: new Date(),
    }
  })
}

module.exports = {
  up: async (query) => {
    await query.bulkInsert(
      'review_question_sets',
      addTimeStamps(initialReviewQuestionSet),
      {}
    )
    await query.bulkInsert('peer_reviews', addTimeStamps(InitialPeerReview), {})
    await query.bulkUpdate(
      'configurations',
      { review_question_set2_id: 2 },
      { id: 1 }
    )
  },

  down: async (query) => {
    await query.bulkDelete('review_question_sets', null, {})
    await query.bulkDelete('peer_reviews', null, {})
    await query.bulkUpdate(
      'configurations',
      { review_question_set2_id: null },
      { id: 1 }
    )
  },
}
