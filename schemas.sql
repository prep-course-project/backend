CREATE TABLE IF NOT EXISTS Favorites(
    id serial primary key,
    externalID integer ,
    price float,
    title varChar(10000),
    imgUrl varChar(1000)
)   