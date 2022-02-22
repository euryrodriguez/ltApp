SELECT
    A.n1 AS Primera,
    A.n2 AS Segunda,
    A.n3 AS Tercera,
    A.nd AS FECHA
FROM
    `quiniela` AS A
INNER JOIN `quiniela` AS B
ON
    a.id = B.id
WHERE
    A.nd > '2019-01-01';