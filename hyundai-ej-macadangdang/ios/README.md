# iOS contact app

Open `BusinessCard/BusinessCard.xcodeproj` on a Mac in Xcode, select the `BusinessCard` target, choose your Apple development team under **Signing & Capabilities**, and set a unique bundle identifier before building and installing it on an iPhone. This is an optional native app project; the website's **Save contact** button now links directly to the vCard file and does not require this app.

When launched with `bydcard://save-contact`, the installed app presents a prefilled native **New Contact** form, where the client can review, edit, and choose whether to tap **Save**. No Contacts permission is needed before presenting this form.

The contact details are currently defined in `BusinessCard/BusinessCardApp.swift` and the website's `../Erik-Jourdan-Macadangdang.vcf`; keep them in sync when updating the card.
