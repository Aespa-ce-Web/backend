# AESPA'CE WEB Backend

## init

```
npm i
```

## run

```
tsc
node lib/API/app.js
```

## vscode launch.json example

just the default launch.json for ts node apps

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/src/API/app.ts",
            "preLaunchTask": "tsc: build - tsconfig.json",
            "outFiles": [
                "${workspaceFolder}/lib/**/*.js"
            ]
        }
    ]
}
```

## Documentation 📚

## Spécifications Techniques des Interfaces d'Entrée/Sortie ⚙️

Le backend utilise principalement le format JSON pour les échanges de données avec le frontend 🌐.

**Entrées:**

* **Requêtes HTTP:** Les données sont reçues via des requêtes HTTP (GET, POST, PUT, DELETE) avec les données dans le corps de la requête (pour POST et PUT) ou dans les paramètres de la requête (pour GET) ✉️.
* **Format JSON:** Les données reçues sont généralement au format JSON, structurées selon les DTOs (Data Transfer Objects) définis dans le code, par exemple:
    * `NouvelleEntreeRequestDto`
    * `NouvelleSortieRequestDto`
    * `InventaireRequestDto`
    * `SupprimerReservationRequestDto`
* **Validation:** Des validations sont effectuées sur les données d'entrée pour vérifier leur format et leur validité (par exemple, les dates dans `RessourcesController`) ✅.

**Sorties:**

* **Réponses HTTP:** Le backend renvoie des réponses HTTP avec des codes de statut indiquant le succès ou l'échec de l'opération (ex: 200 OK, 201 Created, 400 Bad Request, 500 Internal Server Error) 🚦.
* **Format JSON:** Les données renvoyées sont généralement au format JSON, structurées selon des DTOs ou des objets du domaine, par exemple:
    * `NouvelleEntreeResponseDto`
    * `NouvelleSortieResponseDto`
    * `InventaireResponseDto`
    * `Ressource`
    * `Reservation`
* **Messages d'erreur:** En cas d'erreur, des messages d'erreur explicites sont renvoyés au format JSON pour aider le frontend à comprendre la cause du problème ⚠️.

**Stratégie d'Échange de Données**

* **API REST:** Le backend expose une API REST avec des endpoints définis pour chaque opération (ex: `/ressources`, `/stock`) 💻.
* **Requêtes-Réponses:** Le frontend envoie des requêtes au backend et reçoit des réponses synchrones 🔄.
* **CORS:** Le backend utilise CORS pour permettre l'accès depuis le frontend Angular hébergé sur une origine différente 🌐.

**Remarques:**

* Le code utilise des interfaces et des DTOs pour définir clairement les structures de données échangées 📄.
* Des exceptions sont utilisées pour gérer les erreurs et les cas d'erreur spécifiques (ex: `ArticleNotFoundException`, `RessourceNotFoundException`) 🚫.
* Le backend utilise PostgreSQL comme base de données pour stocker les données 🐘.

---

**Ressources**

* **GET /ressources**
    * **Sortie:**
    ```json
    [
      {
        "id": 1,
        "name": "John Doe",
        "type": "human",
        "competences": ["dev"]
      },
      {
        "id": 2,
        "name": "Scie circulaire",
        "type": "machine",
        "competences": ["couper"]
      }
    ]
    ```

* **GET /ressources/available**
    * **Entrée:**
        * `start_date` (string, format AAAA-MM-JJ)
        * `end_date` (string, format AAAA-MM-JJ)
    * **Sortie:**
    ```json
    [
      {
        "resource_id": 1,
        "resource_name": "John Doe",
        "resource_type": "human",
        "resource_groupId": 1,
        "availability_periods": [
          {
            "start_date": "2024-03-01",
            "end_date": "2024-03-05"
          },
          {
            "start_date": "2024-03-10",
            "end_date": "2024-03-15"
          }
        ]
      }
    ]
    ```

* **POST /ressources/reserver**
    * **Entrée:**
    ```json
    {
      "ressource_id": 1,
      "start_date": "2024-03-08",
      "end_date": "2024-03-10"
    }
    ```
    * **Sortie:**
    ```json
    {
      "message": "Ressource réservée"
    }
    ```

* **DELETE /ressources/reservation**
    * **Entrée:**
    ```json
    {
      "ressource_id": 1,
      "start_date": "2024-03-08",
      "end_date": "2024-03-10"
    }
    ```
    * **Sortie:**
    ```json
    {
      "message": "Créneau supprimé"
    }
    ```

* **GET /ressources/reservations**
    * **Entrée:**
        * `ressource_id` (number)
    * **Sortie:**
    ```json
    [
      {
        "reservation_id": 12,
        "ressource_id": 1,
        "start_date": "2024-03-08",
        "end_date": "2024-03-10"
      }
    ]
    ```

**Stock**

* **GET /stock**
    * **Sortie:**
    ```json
    [
      {
        "id": 1,
        "nom": "Marteau",
        "reference": "M001",
        "quantite_stock": 10
      },
      {
        "id": 2,
        "nom": "Clous",
        "reference": "C001",
        "quantite_stock": 100
      }
    ]
    ```

* **POST /stock/entree**
    * **Entrée:**
    ```json
    {
      "articleId": 1,
      "quantite": 5
    }
    ```
    * **Sortie:**
    ```json
    {
      "message": "Entrée de stock ajoutée avec succès",
      "articleId": 1,
      "reference": "M001",
      "nom": "Marteau",
      "quantiteAjoutee": 5,
      "quantiteTotale": 15
    }
    ```

* **POST /stock/sortie**
    * **Entrée:**
    ```json
    {
      "articleId": 1,
      "quantite": 3
    }
    ```
    * **Sortie:**
    ```json
    {
      "nom": "Marteau",
      "reference": "M001",
      "quantite_stock": 12
    }
    ```

* **PUT /stock/inventaire**
    * **Entrée:**
    ```json
    [
      {
        "articleId": 1,
        "quantiteAjustee": 12
      },
      {
        "articleId": 2,
        "quantiteAjustee": 95
      }
    ]
    ```
    * **Sortie:**
    ```json
    [
      {
        "articleId": 1,
        "nom": "Marteau",
        "reference": "M001",
        "quantite_stock": 12
      },
      {
        "articleId": 2,
        "nom": "Clous",
        "reference": "C001",
        "quantite_stock": 95
      }
    ]
    ```

**Hello**

* **GET /hello**
    * **Entrée:**
        * `greeting` (string)
    * **Sortie:**
    ```
    "Hello World!"
    ```

**Messages d'erreur**

En cas d'erreur, le backend renvoie un JSON avec les champs suivants:

```json
{
  "error": "Nom de l'erreur",
  "message": "Description de l'erreur"
}

{
  "error": "ArticleNotFoundException",
  "message": "L'article avec l'ID 123 n'existe pas."
}

{
  "error": "Bad Request",
  "message": "Veuillez fournir une date de début et une date de fin."
}