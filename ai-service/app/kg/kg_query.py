from app.kg.neo4j_client import get_session

def query_kg_for_entities(entities):
    triples = []
    with get_session() as session:
        for ent in entities:
            query = """
            MATCH (a:Entity)-[r]->(b:Entity)
            WHERE a.name CONTAINS $ent OR b.name CONTAINS $ent
            RETURN a.name AS source, type(r) AS relation,
                   b.name AS target, r.example AS sentence
            LIMIT 30
            """
            records = session.run(query, ent=ent)
            for r in records:
                triples.append(dict(r))
    return triples
