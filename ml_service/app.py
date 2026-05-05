from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.linear_model import LinearRegression

app = FastAPI()

class AuctionInput(BaseModel):
    title: str
    prices: list

@app.post("/recommend-price")
def recommend_price(data: AuctionInput):
    prices = data.prices

    if len(prices) < 2:
        return {
            "suggestedStartingPrice": 100,
            "expectedFinalPrice": 500
        }

    df = pd.DataFrame(prices, columns=["price"])

    X = df.index.values.reshape(-1, 1)
    y = df["price"].values

    model = LinearRegression()
    model.fit(X, y)

    next_index = [[len(prices)]]
    predicted_price = model.predict(next_index)[0]

    return {
        "suggestedStartingPrice": int(predicted_price * 0.6),
        "expectedFinalPrice": int(predicted_price)
    }