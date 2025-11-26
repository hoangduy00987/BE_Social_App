from underthesea import ner

def extract_entities(text: str):
    entities = []
    for item in ner(text):
        word, tag = item[0], item[1]
        if tag != "O":
            entities.append(word)
    return list(set(entities))
