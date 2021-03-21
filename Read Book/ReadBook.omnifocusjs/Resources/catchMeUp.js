(() => {
  const tags = ["📘 Book"];

  var action = new PlugIn.Action(async function (selection) {
    // Get current book details
    const project = selection.tasks[0].containingProject;

    const currentBook = selection.tasks
      .map((task) => {
        const pages = task.name.split(" ")[2].split("-");
        const currentPage = Number(pages[0]);
        const endPage = Number(pages[1]);
        return { currentPage, endPage, dueDate: task.dueDate };
      })
      .reduce(
        (accum, task) => ({
          currentPage:
            accum.currentPage < task.currentPage
              ? accum.currentPage
              : task.currentPage,
          endPage: accum.endPage > task.endPage ? accum.endPage : task.endPage,
          dueDate: accum.dueDate > task.dueDate ? accum.dueDate : task.dueDate,
        }),
        {}
      );

    currentBook.title = selection.tasks[0].name.substring(
      selection.tasks[0].name.indexOf("of") + 3
    );

    const getDaysArray = function (s, e) {
      for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        a.push(new Date(d));
      }
      return a;
    };

    // Input Form
    const inputForm = new Form();
    inputForm.addField(
      new Form.Field.String("title", "Title", currentBook.title)
    );
    inputForm.addField(new Form.Field.Date("start", "Start Date", new Date()));
    inputForm.addField(
      new Form.Field.Date("end", "End Date", currentBook.dueDate)
    );
    inputForm.addField(
      new Form.Field.String(
        "currentPage",
        "Current Page",
        currentBook.currentPage
      )
    );
    inputForm.addField(
      new Form.Field.String("pages", "Number of Pages", currentBook.endPage)
    );

    inputForm
      .show("Book information:", "Continue")
      .then((formObject) => {
        const book = formObject.values
        const pages = Number(book.pages);
        const currentPage = Number(book.currentPage);

      // Update the title and due date of all of the tasks
      // If you need more tasks, make more
      // If there are extra tasks, delete them

      const dayList = getDaysArray(book.start, book.end);

      const pagesPerDay = Math.ceil(
        (pages - currentPage + 1) / dayList.length
      );

      dayList.forEach((day, i) => {
        const start = i * pagesPerDay + currentPage;
        const possibleEnd = start + pagesPerDay - 1;
        const end = possibleEnd > pages ? pages : possibleEnd;
        const name = `Read pages ${start}-${end} of ${book.title}`;

        let task;
        if (selection.tasks[i]) {
          task = selection.tasks[i];
          task.name = name;
        } else {
          task = new Task(name, project);
        }
        task.dueDate = day;
        tags.forEach((tag) => {
          task.addTag(flattenedTags.filter((t) => t.name === tag)[0]);
        });
      });

      // delete any possible old tasks
      selection.tasks
        .filter((task, i) => i >= dayList.length)
        .forEach((task) => {
          deleteObject(task);
        });
      });
  });
  action.validate = function (selection, sender) {
    // validation code
    // selection options: tasks, projects, folders, tags
    return selection.tasks.length >= 1;
  };
  return action;
})();
