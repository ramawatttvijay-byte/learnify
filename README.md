# Learnify — website + backend

Ek hi folder mein poori website aur backend hai:

- `public/` — website (home, skills, pricing, jobs, student panel, admin)
- `netlify/functions/api.mjs` — backend API: login, payment, courses, affiliate, payouts, KYC, admin
- Database: **MongoDB Atlas (free M0)**
- Hosting: **Netlify (free plan)**
- Payment: **Razorpay** (aapka existing account)
- Videos: **Google Drive** (lesson mein Drive link paste karna hai)

Kharcha: sirf domain. Baaki sab free plan pe.

---

## 1. MongoDB Atlas (database) — 10 minute

1. https://cloud.mongodb.com pe login karo → **Create** → **Free (M0)** cluster.
2. Provider **AWS**, region **Mumbai (ap-south-1)** chuno → Create.
3. **Database Access** → Add user → username + strong password (note kar lo).
4. **Network Access** → Add IP → **Allow access from anywhere (0.0.0.0/0)**.
   Netlify ke servers ka IP fix nahi hota, isliye ye zaroori hai. Password strong rakho.
5. **Connect** → **Drivers** → connection string copy karo. Usmein `<password>` ki jagah apna password daalo.
   Ye aapka `MONGODB_URI` hai.

## 2. GitHub pe code daalo — 5 minute

1. https://github.com → **New repository** → naam `learnify` → **Private** → Create.
2. **uploading an existing file** pe click karo → is folder ki saari files aur folders drag karke daalo → **Commit**.
   (Ya GitHub Desktop app se push karo.)

## 3. Netlify pe deploy — 10 minute

1. https://app.netlify.com → **Add new site** → **Import an existing project** → **GitHub** → `learnify` repo chuno.
2. Build settings khud `netlify.toml` se aa jaayengi (publish: `public`, functions: `netlify/functions`). Build command khaali chhodo.
3. **Environment variables** mein ye daalo (`.env.example` dekho):

| Naam | Kya daalna hai |
| --- | --- |
| `MONGODB_URI` | Step 1 wali connection string |
| `MONGODB_DB` | `learnify` |
| `JWT_SECRET` | 40+ characters ka koi bhi random text (kisi ko mat batana) |
| `ADMIN_EMAILS` | Aapka aur Akash ka email, comma se: `vijay@gmail.com,akash@gmail.com` |
| `RAZORPAY_KEY_ID` | Razorpay → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Wahi se |
| `RAZORPAY_WEBHOOK_SECRET` | Step 5 mein banega |

4. **Deploy** dabao. 1–2 minute mein `something.netlify.app` pe site live.
5. Check: `https://aapki-site.netlify.app/api/health` kholo → `{"ok":true}` aana chahiye.

## 4. Domain jodo

Netlify → **Domain management** → **Add a domain** → apna domain likho → jo DNS records Netlify bataye, woh apne domain registrar (GoDaddy/Hostinger) mein daalo. HTTPS (SSL) Netlify free mein khud laga dega.

## 5. Razorpay jodo

1. Razorpay Dashboard → **Settings → API Keys** → Live keys generate karo → Netlify env vars mein daalo (Step 3).
2. **Settings → Webhooks → Add new webhook**:
   - URL: `https://aapka-domain.com/api/pay/webhook`
   - Secret: koi bhi strong text → yahi `RAZORPAY_WEBHOOK_SECRET` mein daalo
   - Events: `payment.captured`, `order.paid`, `refund.processed`
3. Env vars badalne ke baad Netlify mein **Deploys → Trigger deploy** dabao.
4. Razorpay mein website URL aapka domain hi hona chahiye (account activation ke waqt diya tha).

Payment ka flow: student "Enroll now" dabata hai → Razorpay khulta hai → payment ke baad server signature check karta hai → course turant unlock. Agar browser beech mein band ho gaya, webhook se bhi unlock ho jaata hai.

## 6. Pehla login (admin)

Site pe **Login | Register → Create account** — `ADMIN_EMAILS` wale email se. Header mein **Admin** dikhega.

Admin mein:
- **Courses & lessons:** price, status (Live / Coming soon / Hidden), thumbnail, har lesson ka Drive link, free preview
- **Packages:** "Skills included" mein `all` likho (sab skills) ya slugs: `meta-ads,content-creation`
- **Reviews, Jobs, Missions, Team photos, WhatsApp number, Social links**

## 7. Videos Google Drive pe

Har lesson ke liye:

1. Video Drive pe upload karo.
2. **Share** → General access: **Anyone with the link** → **Viewer**.
3. Share ke settings (⚙) mein **"Viewers and commenters can see the option to download, print, and copy"** ka tick hatao.
4. **Copy link** → Admin → lesson ke "Google Drive video link" mein paste → **Save course**.

Website kya karti hai:
- Drive link sirf usi student ko milta hai jo logged-in hai aur us course ka paisa de chuka hai. Website ke public code mein link nahi hota.
- Player ke upar student ka phone/email watermark chalta hai, aur Drive ka "open in new window" button dhaka rehta hai.
- Ek account ek time pe ek hi device pe login rehta hai (naye device pe login = purana logout).

Dhyan rakho (sach bata raha hoon):
- Free Google account mein **15 GB** milta hai (Gmail + Photos ke saath shared). Zyada chahiye toh doosre Google account mein bhi videos rakh sakte ho.
- Link ek baar kisi enrolled student ke paas pahunch gaya toh woh use share kar sakta hai; Drive isko poori tarah nahi rok sakta. Watermark se pata chalega kisne kiya.
- Jo video bahut zyada baar dekha jaaye, Google usko kuch der ke liye rok sakta hai. Pehle ek video test karo.
- Download band karne ke baad, website mein embed hone wala video chal raha hai ya nahi — ye bhi pehle ek video pe check karo.

## 8. Launch se pehle test

- [ ] Ek naye email se signup → kisi course pe Enroll → Razorpay test mode mein payment → course unlock
- [ ] Doosre browser mein bina login ke `/#dash-learn-meta-ads` kholo → "locked" dikhna chahiye
- [ ] Referral: apna affiliate link incognito mein kholo → naya account → kharido → affiliate ke dashboard mein commission (7 din pending)
- [ ] KYC submit → Admin approve → Withdraw request → Admin "paid" mark
- [ ] Phone pe poori site, light aur dark dono

## Free limits

| Service | Free mein | Note |
| --- | --- | --- |
| Netlify | 300 credits / mahina | Limit poori hui toh site mahine ke end tak ruk jaati hai. Netlify dashboard mein usage dekhte raho |
| MongoDB Atlas M0 | 512 MB | Hazaron students ke liye kaafi |
| Google Drive | 15 GB | Account ke hisaab se |
| Razorpay | Koi monthly fee nahi | Har payment pe 2% + GST katta hai |

## Developer notes

- `npm test` — backend ke tests (in-memory database ke saath, internet ki zaroorat nahi)
- Commission (default ₹625), hold period (7 din), minimum withdraw (₹500): MongoDB ke `site` collection mein `settings` document se badal sakte ho
- Passwords scrypt se hash hote hain; login cookie HttpOnly + Secure hai

---

## Cloudflare (main hosting from 1 December)

Free plan, selling allowed, no "Powered by" badge. Same code, same database.

- `worker.mjs` — Cloudflare entry. Pages and images come from `public/` (free, unlimited); `/api/*` goes to one Durable Object that keeps the MongoDB connection open.
- `wrangler.jsonc` — Cloudflare settings. `public/_headers` — security and cache headers.
- Secrets (Cloudflare → Workers → learnify → Settings → Variables and Secrets):
  `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAILS`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- Auto-update: Cloudflare → Workers → learnify → Settings → Build → connect GitHub repo `learnify`, branch `main`. Every push redeploys.
- Razorpay webhook URL after the move: `https://<your-domain>/api/pay/webhook`
