(() => {
  const tags = ['📘 Book'];

  var action = new PlugIn.Action(async function(selection) {
    // Get current book details
    const project = selection.tasks[0].containingProject;

    const currentBook =
        selection.tasks
            .map((task) => {
              const pages = task.name.split(' ')[2].split('-');
              const currentPage = Number(pages[0]);
              const endPage = Number(pages[1]);
              return {currentPage, endPage, dueDate: task.dueDate};
            })
            .reduce(
                (accum, task) => ({
                  currentPage: accum.currentPage < task.currentPage ?
                      accum.currentPage :
                      task.currentPage,
                  endPage: accum.endPage > task.endPage ? accum.endPage :
                                                          task.endPage,
                  dueDate: accum.dueDate > task.dueDate ? accum.dueDate :
                                                          task.dueDate,
                }),
                {});

    currentBook.title = selection.tasks[0].name.substring(
        selection.tasks[0].name.indexOf('of') + 3);

    const getDaysArray = function(s, e) {
      for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        a.push(new Date(d));
      }
      return a;
    };

    // Input Form
    const inputForm = new Form();
    inputForm.addField(
        new Form.Field.String('title', 'Title', currentBook.title));
    inputForm.addField(new Form.Field.Date('start', 'Start Date', new Date()));
    inputForm.addField(
        new Form.Field.Date('end', 'End Date', currentBook.dueDate));
    inputForm.addField(new Form.Field.String(
        'currentPage', 'Current Page', currentBook.currentPage));
    inputForm.addField(
        new Form.Field.String('pages', 'Number of Pages', currentBook.endPage));

    inputForm.show('Book information:', 'Continue').then((formObject) => {
      const book = formObject.values
      const pages = Number(book.pages);
      const currentPage = Number(book.currentPage);

      const dayList = getDaysArray(book.start, book.end);
      const pagesPerDay = Math.ceil((pages - currentPage + 1) / dayList.length);

      // Update or create tasks
      dayList.forEach((day, i) => {
        const start = i * pagesPerDay + currentPage;
        let possibleEnd = start + pagesPerDay - 1;
        possibleEnd =
            possibleEnd > pages ? pages : possibleEnd;  // 确保不超过总页数

        // 如果开始页码大于总页数，则不创建新任务
        if (start > pages) {
          return;
        }

        const name = `Read pages ${start}-${possibleEnd} of ${book.title}`;

        let task;
        if (i < selection.tasks.length) {
          task = selection.tasks[i];
          task.name = name;
        } else {
          task = new Task(name, project);
        }
        task.dueDate = day;
        tags.forEach((tag) => {
          const tagToAdd = flattenedTags.find((t) => t.name === tag);
          if (tagToAdd) {
            task.addTag(tagToAdd);
          }
        });
      });

      // Delete extra tasks
      if (dayList.length < selection.tasks.length) {
        selection.tasks.slice(dayList.length).forEach((task) => {
          deleteObject(task);
        });
      }
    });
  });

  action.validate = function(selection, sender) {
    return selection.tasks.length >= 1;
  };

  return action;
})();