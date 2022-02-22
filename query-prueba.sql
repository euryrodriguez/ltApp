SELECT A.n1 AS Primera, A.n2 AS Segunda, A.n3 AS Tercera, A.nd AS FECHA
FROM `national` AS A
INNER JOIN `national` AS B
ON a.id = B.id
WHERE A.n1 = B.n1
AND A.n2 = B.n2
AND A.n3 = B.n3
AND A.nd > '2017-06-06'
