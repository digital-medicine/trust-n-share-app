# TrustNShare Data Donor App

The iOS / Android Data Donor App of the TrustNShare research project.  
TrustNShare is a participatory developed, smart contract-based data trust model with scalable trust and incentivization.

End users (data donors) can use this app to select Health data that is collected by the smartphone, and upload it to a
data marketplace in a trusted way. They can then receive compensations when data consumers use their data.

**Publications:**
- [TrustNShare Partizipativ entwickeltes, Smart-contract basiertes Datentreuhandmodell mit skalierbarem Vertrauen und Inzentivierung](https://elib.dlr.de/199798/)
- [Development of a Blockchain-Based Data Trust Model for Secure and Controlled Health Data Sharing Grounded on Empirical Research](https://ebooks.iospress.nl/doi/10.3233/SHTI230472)

## Building from source
This is a fairly standard **React Native** project.

_Warning: This has not been tested on a clean machine, and may require additional setup. Feel free to open a PR with any additional steps._

**Requirements:**
- Node / NPM
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

**Steps:**
1. Clone the repository
2. Run `cp .env.example .env` and adjust the values
3. Run `npm install`
4. Run `cd ios && pod install && cd ..`
5. Run `npm start` to start the Metro bundler
6. In a new shell, run `npm run ios` or `npm run android`

## Documentation

### Structure
- `App.tsx` is the main entry point and contains the screen structure and navigation setup
- `app/` contains the main source code
  - `components/` contains reusable components
  - `screens/` contains the main screens
  - `stores/` contains local storage and state management using zustand
  - `utils/` contains utility functions and the API client
- `.env` holds the environment-specific configuration

### .env values
- `API_URL` - URL of the TrustNShare backend API (developed by UKJ)
- `PRIVACY_API_URL` - URL of the API that calculates the value of data when obfuscation is applied
- `FORM_DURATION` - Default value for how long the data should be offered, in months
- `FORM_PRIVACY_INCENTIVE` - Default value for how much the data is worth to the user without obfuscation, in €
- `FORM_BUYER_REPUTATION` - Default value for the minimum reputation a buyer should have, in €
- `COMPENSATIONS_DELAY_MIN` and `COMPENSATIONS_DELAY_MAX` - After submitting, the user will have to wait a random amount of time between these values (in milliseconds) before the compensations are available.
- `CONSUMER_BUY_CHANCE` - The chance that a consumer will buy the data, from 0 to 1.

## Attribution

Logo by Flaticon: [love and romance icons](https://www.flaticon.com/free-icons/love-and-romance)
