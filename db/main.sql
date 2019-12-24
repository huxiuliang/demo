CREATE TABLE "air" (
"week"  TEXT,
"max"  TEXT,
"min"  TEXT,
"avg"  TEXT
);

CREATE TABLE "prop" (
"pId"  TEXT NOT NULL,
"id"  TEXT NOT NULL,
"name"  TEXT NOT NULL,
"keyName"  TEXT NOT NULL,
PRIMARY KEY ("pId" ASC, "id" ASC)
);


CREATE TABLE "tagprop" (
"tagId"  INTEGER NOT NULL,
"propId"  TEXT NOT NULL
);

CREATE TABLE "tags" (
"id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL DEFAULT 100000,
"tagName"  TEXT NOT NULL,
"type"  TEXT,
"sts"  TEXT,
"className"  TEXT
);


CREATE TABLE "propitems" (
"id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
"pId"  TEXT NOT NULL,
"type"  TEXT,
"name"  TEXT,
"tag"  TEXT,
"items"  TEXT,
"opt"  TEXT,
"value"  TEXT,
"tagId"  INTEGER,
"keyName"  TEXT,
"sqen"  INTEGER
)
;


CREATE TABLE "sysinfo" (
"initSts"  INTEGER NOT NULL
)

