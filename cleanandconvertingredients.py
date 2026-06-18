#Dataset is from Kaggle: Skin care product ingredients - INCI List
#Link: https://www.kaggle.com/datasets/amaboh/skin-care-product-ingredients-inci-list


import pandas as pd
import json
import ast
import re

#import dataset
df = pd.read_csv("ingredientsList.csv")

#create an empty dictionary
ingredients = {}

#function that returns an empty list if the value is empty
def clean_list(value):
    if pd.isna(value):
        return []

    try:
        #to convert the strings in the csv to python vals
        parsed = ast.literal_eval(str(value))

        cleaned_items = []

        for item in parsed:
            #remove extra spaces
            item = item.strip()

            #only keep non-empty values
            if item != "":
                cleaned_items.append(item)

        return cleaned_items

    except:
        return []

#cleans the bullet points
def clean_bullet_points(text):
    if pd.isna(text):
        return []

    #covert to string and remove the extra space
    text = str(text).strip()

    #remove the intro phrase
    text = re.sub(
        r".*?benefits such as:\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    #split into bullets
    bullets = re.split(r"\r?\n-\s*", text)

    cleaned = []

    for bullet in bullets:
        bullet = bullet.strip()

        #remove any remaining leading dashs
        bullet = re.sub(r"^-\s*", "", bullet)

        if bullet:
            cleaned.append(bullet)

    return cleaned

#looping through the dataframe
for _, row in df.iterrows():

    #one ingredient at a time
    name = str(row["name"]).strip().lower()

    ingredients[name] = {
        "description": str(row["short_description"]).strip(),
        "whatIsIt": str(row["what_is_it"]).strip(),
        "whatDoesItDo": clean_bullet_points(row["what_does_it_do"]),
        "goodFor": clean_list(row["who_is_it_good_for"]),
        "avoidFor": clean_list(row["who_should_avoid"])
    }

#build the json file
with open("ingredients.json", "w", encoding="utf-8") as file_export:
    json.dump(
        ingredients,
        file_export,
        indent=2,
        ensure_ascii=False
    )

from google.colab import drive
drive.mount('/content/drive')