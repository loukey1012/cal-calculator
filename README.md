# CALculator

A lightning-fast, offline-first calorie and protein tracker built for speed in the kitchen. 

You do not need to download anything from an app store, create an account, or pay for a subscription. Just open the link, add it to your home screen, and start tracking!

## 🚀 How to Use (Takes 10 Seconds)

The app runs entirely in your web browser and saves data directly to your device. 

1. **Open the App:** Navigate to this repository's hosted link (e.g., `https://loukey1012.github.io/cal-calculator/`) on your phone's browser (Safari for iPhone, Chrome for Android).
2. **Install to Home Screen:** - **iPhone:** Tap the "Share" button (square with an arrow pointing up) at the bottom of Safari, scroll down, and tap **"Add to Home Screen"**.
   - **Android:** Tap the three dots menu in Chrome and select **"Add to Home screen"**.
3. **Start Tracking:** Open the app from your home screen. It will now act exactly like a native app. Your data saves automatically to your phone.

## ✨ Features
- **Instant Speed:** Zero loading screens. Works perfectly offline.
- **Custom Numpad:** Tap an item to get a massive, easy-to-tap number pad for entering weights.
- **Flexible Tracking:** Track by weight (e.g., 150g) or by unit (e.g., 0.5 apples).
- **Categories:** Organize your database into Ingredients, Snacks, Drinks, and Meals.
- **Themes:** Choose between Dark, Light, Pink, and Red themes in the settings.
- **Copy Totals:** Tap your total calories to instantly copy them to your clipboard.

---

## ☁️ Optional: Sync with a Partner
By default, your food database stays only on your phone. If you want to share and sync your food list with someone else (like a partner), you can connect the app to a free GitHub cloud file.

**Step 1: Create a Secret File (Gist)**
1. Go to [gist.github.com](https://gist.github.com/) (you will need a free GitHub account).
2. Create a new **Secret Gist**.
3. Name the file exactly `foodDb.json`.
4. Put `[]` in the big text box and click **Create secret gist**.
5. Look at the URL in your browser. Copy the long string of random characters at the very end. This is your **Gist ID**.

**Step 2: Get a Password (Token)**
1. Go to your GitHub **Developer Settings** -> **Personal Access Tokens** -> **Fine-grained tokens**.
2. Click **Generate new token**.
3. Scroll down to **Account permissions**, find **Gists**, and set it to **Read and write**.
4. Generate the token and copy it.

**Step 3: Connect the App**
1. Open CALculator on your phone.
2. Scroll down to the **GitHub Sync Settings** menu.
3. Paste your **Token** and **Gist ID**, then tap **Save Credentials**.
4. **Repeat this exact step on your partner's phone** using the *same* Token and Gist ID. Any food you add or edit will now instantly sync between your phones!