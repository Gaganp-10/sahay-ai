def is_repeated_question(query, past_queries):
    for q in past_queries:
        if query.lower() in q.lower() or q.lower() in query.lower():
            return True
    return False