SELECT p.title , p.price, c.name, o.createdAt as "purchaseDate"
FROM "Order" o WHERE o.id = $1
JOIN "Product" p ON  p.id = o."productId"
JOIN "Client" c ON c.id = o."clientId"