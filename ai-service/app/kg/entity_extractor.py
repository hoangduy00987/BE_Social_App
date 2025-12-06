from underthesea import ner
import re

INVALID_TYPES = {'O'}
MIN_ENTITY_LENGTH = 2

def load_stopwords(filepath='./vietnamese-stopwords.txt'):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return set(line.strip().lower() for line in f if line.strip())
    except:
        return {
            'trên', 'dưới', 'trong', 'ngoài', 'của', 'và', 'với', 'cho', 'từ', 'đến',
            'này', 'đó', 'kia', 'các', 'những', 'một', 'hai', 'ba', 'nhiều',
            'được', 'có', 'là', 'rất', 'đã', 'sẽ', 'đang', 'thì', 'để', 'bị'
        }

STOPWORDS = load_stopwords('../code/vietnamese_stopwords.txt')

def is_valid_entity(entity, entity_type):
    entity_clean = entity.lower().strip()
    if len(entity_clean) < MIN_ENTITY_LENGTH:
        return False
    if entity_clean in STOPWORDS:
        return False
    words = entity_clean.split()
    if len(words) == 1 and words[0] in STOPWORDS:
        return False
    if entity_clean.isdigit():
        return False
    if not re.search(r'[a-zA-ZÀ-ỹ]', entity, re.UNICODE):
        return False
    if entity_type in INVALID_TYPES:
        return False
    return True

def normalize_entity(entity):
    entity = re.sub(r'\s+', ' ', entity.strip())
    entity = re.sub(r'^[^\w\s]+|[^\w\s]+$', '', entity, flags=re.UNICODE)
    return entity

def extract_entities(sentence: str):
    global  success_count, total_entities_found
    entities = []
    try:
        ner_results = ner(sentence)
        success_count += 1
        merged_entities = [(item[0], item[3]) for item in ner_results]
        for entity, entity_type in merged_entities:
            entity_normalized = normalize_entity(entity)
            if is_valid_entity(entity_normalized, entity_type):
                entities.append(entity_normalized)
                total_entities_found += 1
    except:
        pass
    return entities
