# API Communautaire COSYlanguages

## Endpoints principaux

### Posts
- `GET /posts` : Récupère tous les posts vidéo (avec auteur, likes, etc.)
- `POST /posts/add` : Crée un post vidéo
  - Champs attendus :
    - `author` (ObjectId utilisateur)
    - `caption` (texte)
    - `video` (fichier, optionnel)
- `POST /posts/:id/like` : Like/unlike un post
  - Champs attendus :
    - `userId` (ObjectId utilisateur)

### Events
- `GET /events` : Liste tous les événements
- `POST /events/add` : Crée un événement
  - Champs attendus :
    - `title`, `start`, `end`, `description`, `topics`, `discussion`, `vocabulary`, `round1`, `round2`
- `POST /events/update/:id` : Met à jour un événement
- `GET /events/:id` : Détail d’un événement

### Progress
- `GET /progress/:courseId/:studentId` : Récupère la progression d’un étudiant dans un cours
- `POST /progress/update` : Met à jour la progression
  - Champs attendus :
    - `courseId`, `studentId`, `lessonId`, `score`

## Notes
- Toutes les routes acceptent et renvoient du JSON (sauf upload vidéo : multipart/form-data).
- Les IDs doivent être des ObjectId MongoDB valides.
- Les routes sont accessibles sans authentification dans la version de base (à sécuriser en production).

## Exemples d’utilisation

### Créer un post vidéo
```bash
curl -F "author=USER_ID" -F "caption=Mon post" -F "video=@/chemin/vers/video.mp4" http://localhost:3001/posts/add
```

### Liker un post
```bash
curl -X POST -H "Content-Type: application/json" -d '{"userId": "USER_ID"}' http://localhost:3001/posts/POST_ID/like
```

### Créer un événement
```bash
curl -X POST -H "Content-Type: application/json" -d '{"title": "Club de parole", "start": "2025-08-01T18:00:00Z", "end": "2025-08-01T19:00:00Z"}' http://localhost:3001/events/add
```
