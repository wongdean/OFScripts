# Read Book

It asks you the name of the book, the start date, the end date, and the number of pages.

![The prompt of the script](read-book.png)

Then it creates a new project with the tags specified in the script, and it takes you to that project.

![The project that was created](read-book-project.png)

## Install

To install this plug-in:

1) [Download the `.omnifocusjs` zip file](https://raw.githubusercontent.com/agarrharr/OFScripts/master/Read%20Book/ReadBook.zip)

2) In the Files app (iOS/iPadOS) or the Finder (macOS), unpack the downloaded ZIP archive to extract the plug-in file.

3) On macOS, select “Plug-Ins…” from the Automation menu, and drag the unpacked plug-in file into the forthcoming “Plug-Ins” OmniFocus window.

4) On iOS or iPadOS, tap the plug-in file to summon the contextual menu. It will open OmniFocus and install the plug-in.

## Customize

You can customize the tags that are applied by changing the code in `readBook.js` to include as many tags you want:

```js
const tags = ["📘 Book", "important"];
```

Or no tags at all:

```js
const tags = [];
```