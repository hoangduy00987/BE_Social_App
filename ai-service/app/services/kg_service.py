from neo4j import GraphDatabase
from app.core.config import NEO4J_URI, NEO4J_PASSWORD, NEO4J_USER

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def query_kg_for_entities(entities):
    results = []
    with driver.session() as session:
        for ent in entities:
            query = """
            MATCH (a:Entity)-[r:REL]->(b:Entity)
            WHERE toLower(a.name) CONTAINS toLower($ent)
            OR toLower(b.name) CONTAINS toLower($ent)
            RETURN 
                a.name AS source,
                r.type AS relation,    
                b.name AS target,
                r.sentence AS sentence   
            LIMIT 5;
            """
            recs = session.run(query, ent=ent)
            for r in recs:
                results.append(dict(r))
    return results
