FORMAT: 1A

# ggquizz

This API enables users to view questions and contribute to them.

## http://localhost:3000/questions [/questions]

### http://localhost:3000/questions [GET]

Allow users to see all questions stored in the database.


+ Response 200 (application/json; charset=utf-8)

    + Body

            [
                {
                    "answers": [
                        "Hurlevent",
                        "Stormwind"
                    ],
                    "question": "Quel est le nom de la célèbre ville de l'Alliance ?",
                    "date": "2018-09-30T10:05:39.183Z",
                    "id": "5bb09ff34ba203118d570b1a"
                },
                {
                    "answers": [
                        "Hurlevent",
                        "Stormwind"
                    ],
                    "question": "Quel est le nom de la célèbre ville de l'Alliance ?",
                    "date": "2018-09-30T10:06:39.335Z",
                    "id": "5bb0a02fa1f32c11994e3772"
                },
                {
                    "answers": [
                        "Hurlevent",
                        "Stormwind"
                    ],
                    "question": "Quel est le nom de la célèbre ville de l'Alliance ?",
                    "date": "2018-09-30T10:07:27.011Z",
                    "id": "5bb0a05f12881d11af0839ce"
                },
                {
                    "answers": [
                        "Hurlevent",
                        "Stormwind"
                    ],
                    "question": "Quel est le nom de la célèbre ville de l'Alliance ?",
                    "date": "2018-09-30T10:27:40.253Z",
                    "id": "5bb0a51c18bc60126786cf13"
                }
            ]

## http://localhost:3000/questions [/questions]

### http://localhost:3000/questions [POST]

Allow users to contribute a new question to the database.

+ Request (application/json)

        {
            "question": "Quel est le nom de la célèbre ville de la Horde ?",
            "answers": [
                "Ogrimmar"
            ]
        }

+ Response 200 (application/json; charset=utf-8)

    + Body

            {
                "message": "Question created",
                "question": {
                    "answers": [
                        "Ogrimmar"
                    ],
                    "question": "Quel est le nom de la célèbre ville de la Horde ?",
                    "date": "2018-09-30T11:03:36.307Z",
                    "id": "5bb0ad8868282f197f759d6d"
                }
            }

