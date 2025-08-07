# Application Information Architecture

## Current Architecture

This document outlines the current information architecture of the CosyLanguages application.

### Main Navigation (/ and /login)

- **Landing Page (`/`)**: The main entry point for the application.
- **Login Page (`/login`)**: Page for user authentication.

### Core Features (Accessible from the Header)

- **Freestyle Mode (`/freestyle`)**: A flexible learning mode with various exercises.
- **Study Mode (`/study/:lang`)**: A structured learning mode with a curriculum.
- **Community (`/community`)**: A social hub for users to interact.
- **Calculator (`/calculator`)**: A tool for language-related calculations.
- **My Sets (`/my-sets`)**: A protected page for users to manage their study sets.
- **Admin (`/admin/clubs`)**: A protected page for administrators to manage clubs.
- **Profile (`/profile`)**: A protected page for users to manage their profile.

### Study Mode Sub-pages

- **Personalization (`/personalize`)**: Page to personalize the study experience.
- **Interactive (`/interactive`)**: Page with interactive exercises.
- **Study Tools (`/study-tools`)**: Page with various study tools.
- **Dictionary (`/dictionary`)**: Page with a dictionary tool.
- **Grammar Guidebooks (`/grammar-guidebooks`)**: Page with grammar resources.
- **Review (`/review`)**: Page for reviewing learned material.
- **Learned Words (`/learned-words`)**: Page to track learned vocabulary.
- **Conversation (`/conversation`)**: Page for practicing conversations.

### Community Sub-pages

- **Speaking Club (`/speaking-club`)**: Page to select a speaking club.
- **Speaking Club Event (`/speaking-club/:eventId`)**: Page for a specific speaking club event.

### Other Pages

- **Gamification/Progress (`/progress`)**: Page to track user progress and gamification elements.

---

## Proposed Simplified Architecture

The goal of this new architecture is to simplify the main navigation and group related features in a more logical and intuitive way.

### Main Navigation (Header)

The main navigation will be streamlined to focus on the three core pillars of the application:

- **Freestyle (`/freestyle`)**: Unstructured practice and exploration.
- **Study (`/study`)**: Structured learning with a curriculum.
- **Community (`/community`)**: Social interaction and language exchange.

### User Menu (Dropdown from Profile)

A user menu will be introduced to consolidate user-specific pages:

- **Profile (`/profile`)**: User's main profile page, possibly with a dashboard view of progress.
- **My Sets (`/my-sets`)**: User's custom study sets.
- **Settings (`/profile/settings`)**: Account settings.
- **Logout**

### Tools Section

A dedicated "Tools" section will be created to house utility features, accessible from the main navigation or a unified "Study" dashboard.

- **Grammar Guidebook (`/tools/grammar`)**
- **Dictionary (`/tools/dictionary`)**
- **Calculator (`/tools/calculator`)**

### Reorganization of "Study Mode"

The "Study Mode" will be redesigned to be a unified dashboard experience. The various sub-pages will be accessible from within this dashboard, for example, through a sidebar or tabs, rather than being scattered as separate top-level routes.

- **/study/:lang** (Main dashboard)
  - **Lessons / Curriculum**
  - **Review**
  - **Learned Words**
  - **Conversation Practice**
  - **Personalization**

This structure will make the application easier to navigate and understand, providing a more focused and less overwhelming experience for the user.

### Authentication and Onboarding

To create a more welcoming and modern experience, the authentication and onboarding process will be simplified.

**1. Simplified Sign-Up:**
- The sign-up process will be streamlined to require minimal information:
  - **Username/Display Name**
  - **Primary Language of Study**
  - **Proficiency Level** (e.g., Beginner, Intermediate, Advanced)
- We will move away from traditional password-based authentication. Instead, we can explore options like:
  - **Social Logins** (Google, Facebook, etc.)
  - **Passwordless Authentication** (e.g., magic links sent to email)

**2. Guest Mode:**
- A "guest mode" will be introduced to allow new users to explore the application's features without needing to create an account.
- This will lower the barrier to entry and allow users to experience the value of the app before committing to signing up.

**3. Unified Language Management:**
- A centralized "Language Dashboard" will be created within the user's profile. From here, users can:
  - View all the languages they are learning.
  - Add new languages to their profile at any time.
  - Set their primary language of study.
  - Easily switch between the languages they are learning from the main header. This will be a new, dedicated language switcher for the *learning language*, separate from the UI language selector.
