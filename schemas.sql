DROP TABLE IF EXISTS comment;
CREATE TABLE IF NOT EXISTS Favorites(
    id serial primary key,
    externalID integer ,
    price float,
    title varChar(10000),
    imgUrl varChar(1000),
    area varChar(1000),
    purpose varChar(1000)
);
CREATE TABLE IF NOT EXISTS UserProperties(
    id serial primary key,
    title varChar(1000),
    area float,
    purpose varChar (1000),
    price float,
    propertyDescription varChar(10000),
    roomsNum integer,
    bathsNum integer,
    propertyType varChar(1000),
    cityName varChar(100)
);
CREATE TABLE IF NOT EXISTS comment(
    id serial primary key,
        externalID integer ,
        commentName varChar(1000),
        Email varChar(1000),
       comment varChar (1000),
       Rating varChar(1000)
)