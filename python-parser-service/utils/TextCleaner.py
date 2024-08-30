import re

import spacy

# Load the English model
nlp = spacy.load("en_core_web_md")

REGEX_PATTERNS = {
    "email_pattern": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
    "phone_pattern": r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}",
    "link_pattern": r"\b(?:https?://|www\.)\S+\b",
}


class TextCleaner:
    """
    A class for cleaning a text by removing specific patterns.

    See:
        https://github.com/srbhr/Resume-Matcher/blob/main/resume_matcher/dataextractor/TextCleaner.py
    """

    def __init__(self):
        pass

    @staticmethod
    def remove_email_phone_links(text):
        """
        Clean the input text by removing specific patterns.

        Args:
            text (str): The input text to clean.

        Returns:
            str: The cleaned text.
        """
        for pattern in REGEX_PATTERNS:
            text = re.sub(REGEX_PATTERNS[pattern], "", text)
        return text

    def clean_text(self, text):
        """
        Clean the input text by removing specific patterns.

        Args:
            text (str): The input text to clean.

        Returns:
            str: The cleaned text.
        """
        # print('Cleaning text...')
        text = self.remove_email_phone_links(text)
        doc = nlp(text)
        for token in doc:
            if token.pos_ == "PUNCT":
                text = text.replace(token.text, "")
        # print(f'Cleaned text: {text}')
        return str(text)
