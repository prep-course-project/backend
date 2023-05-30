CREATE TABLE IF NOT EXISTS Favorites(
    id serial primary key,
    externalID integer ,
    price float,
    title varChar(10000),
    coverPhoto varChar(1000),
    area varChar(10000),
    purpose varChar(300)
)   