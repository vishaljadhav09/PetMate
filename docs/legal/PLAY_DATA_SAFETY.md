# Google Play: Data safety form answers (DRAFT)

Use these when filling _Play Console → App content → Data safety_. They match what the app does today. Re-check the form against Google's current wording before submitting, and update it if the app changes.

## Overview questions

| Question                                                              | Answer                                                                                                |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Does your app collect or share any of the required user data types?   | Yes                                                                                                   |
| Is all of the user data collected by your app encrypted in transit?   | Yes (HTTPS)                                                                                           |
| Do you provide a way for users to request that their data is deleted? | Yes: in-app **Profile → Delete account**. Web link: [PUBLIC URL TO A DELETION PAGE, REQUIRED BY PLAY] |
| Does the app follow the Families policy?                              | No (adults only)                                                                                      |

## Data types

| Category            | Data type                                                              | Collected | Shared | Purpose                                                                  | Optional?                        |
| ------------------- | ---------------------------------------------------------------------- | --------- | ------ | ------------------------------------------------------------------------ | -------------------------------- |
| Personal info       | Name                                                                   | Yes       | No     | App functionality, account management                                    | No                               |
| Personal info       | Email address                                                          | Yes       | No     | Account management                                                       | No                               |
| Personal info       | Phone number                                                           | Yes       | No\*   | App functionality (shown to the other owner after a request is accepted) | Yes, but needed to send requests |
| Location            | Approximate location                                                   | Yes       | No     | App functionality (find nearby pets)                                     | Yes (can enter a city)           |
| Photos and videos   | Photos                                                                 | Yes       | No     | App functionality (pet photos, optional certificate)                     | Yes                              |
| App activity        | Other user-generated content (pet details, messages, ratings, reports) | Yes       | No     | App functionality                                                        | No                               |
| Device or other IDs | Device or other IDs (push notification token)                          | Yes       | No     | App functionality (notifications)                                        | Yes                              |

\* Service providers that process data for us (Supabase, Cloudinary, Google, Expo/Firebase) are not counted as "sharing" under Google's definition when they act on our behalf. Confirm this reading in the form's help text.

Do **not** declare: precise location (the app asks for it but stores only a ~500 m rounded value, so declare **approximate**; if Play flags the permission, declare "precise" to be safe), financial info, health info, contacts, or advertising data.

## Other Play items

- **Privacy policy URL:** publish `docs/legal/PRIVACY_POLICY.md` as a public web page and paste the URL.
- **Account deletion URL:** a public page that explains how to delete the account (open the app → Profile → Delete account) and how to request deletion by email.
- **Content rating:** answer the questionnaire honestly. The app is about animals, with user-generated content and user-to-user contact.
- **Target audience:** 18 and over.
- **App access:** reviewers need to sign in with Google. Provide a test Google account in "App access".
- **Permissions in the manifest:** location (foreground), photos/media, notifications. Be ready to explain each in the review.
