# How to update upcoming shows

A short guide for band members who manage dates on the Texas, Whiskey & You website.

You do not need any coding. You will work in **Sanity Studio**, which is the back office for the site.

After you publish a change, check [twytribute.com/shows](https://twytribute.com/shows). Updates usually appear in a couple of minutes.

---

## 1. Accept the invite and open Studio

1. Open the Sanity invite email and accept it.
2. Sign in with the email address that received the invite (Google or email login is fine).
3. Open **Texas, Whiskey & You** Studio from the invite link, or go to [sanity.io/manage](https://www.sanity.io/manage), open the project, and launch Studio.

If you get stuck signing in, reply to whoever sent the invite.

---

## 2. Find the show list

On the left side of Studio, click **Show**.

You will see every gig already entered. The list is sorted by date. Each row shows the venue and city.

---

## 3. Add a new show

1. Click **Create** (or **+**) and choose **Show**.
2. Fill in the fields below.
3. Click **Publish** in the bottom-right.

A draft is not live. If you only save and never publish, the website will not change.

### Fields

| Field | Required? | What to enter |
|---|---|---|
| **Venue** | Yes | The place name, exactly as you want it on the site. Example: `Lava Cantina` |
| **City** | Yes | City and state. Example: `The Colony, TX` |
| **Date & Time** | Yes | The show start time. This is what fans see, and it also decides whether the date is upcoming or past. |
| **Ticket URL** | No | Full ticket link, starting with `https://`. Leave blank if there are no public tickets. |
| **Featured Show** | No | Turn this on for the one date you want in the big **Next Up** card. |
| **Recap URL** | No | Leave blank for upcoming dates. After a show, you can add a recap or media link if you have one. |

There is no “upcoming / past” switch. Once the date and time have passed, the site moves the show to **Past Shows** on its own.

---

## 4. Edit a show

1. Click **Show** in the left menu.
2. Open the date you want to change.
3. Update venue, city, time, tickets, or featured.
4. Click **Publish** again.

Use this for a time change, a venue change, or adding tickets later.

---

## 5. Cancel or remove a show

1. Open the show.
2. Open the menu in the top-right of that document (the `⋯` button).
3. Choose **Delete**.
4. Confirm.

Deleting removes it from both Upcoming and Past. If you only want it off the upcoming list, you can also change the date to one that has already passed — but deleting is cleaner for a canceled gig.

---

## Featured show (the “Next Up” card)

The Shows page highlights one date at the top.

- Turn **Featured Show** on for the date you want featured.
- Turn it **off** on the old featured date so only one is checked.
- If nobody is marked featured, the site uses the next upcoming date.

If a featured date is already in the past, the site ignores it and uses the next upcoming show.

---

## Tickets vs Inquire

- If you add a **Ticket URL**, the site shows a **Tickets** button.
- If you leave it blank, the site shows **Inquire** and sends people to the contact form.

That is the right setup for private events or dates that are not on sale yet.

---

## Quick checklist before you publish

- [ ] Venue name looks how you want it on the poster
- [ ] City includes the state (`Dallas, TX`)
- [ ] Date **and** start time are correct
- [ ] Ticket link works, or you left it blank on purpose
- [ ] Only one show is marked Featured (if you care which one is “Next Up”)
- [ ] You clicked **Publish**, not just saved a draft

Then open [twytribute.com/shows](https://twytribute.com/shows) and confirm the date is there.

If it is still missing after a few minutes, publish again and text the person who sent this guide.

---

## Site Settings (emails)

On the left side of Studio, click **Site Settings**. There is only one of these documents. Open it, edit the fields, then click **Publish**.

| Field | What it changes |
|---|---|
| **Public email** | The address visitors see in the footer, on the contact page, and in the booking form fallback. This is separate from the two form inboxes. |
| **Contact recipient** | Where Contact form submissions are emailed. |
| **Contact subject** | Subject line for Contact emails. |
| **Booking recipient** | Where Booking form submissions are emailed. |
| **Booking subject** | Subject line for Booking emails. |

In a subject line, write `{{name}}` where you want the sender's name. Example: `TWY Website Contact: {{name}}` becomes `TWY Website Contact: Jane`.

If you leave a field blank, the site keeps using the current default (`sdmbooking@yahoo.com` and the existing subject lines).
