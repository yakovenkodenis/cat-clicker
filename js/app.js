(function() {

    var model = {

        init: function() {
            localStorage.clear();
            if (!localStorage.kittens) {
                localStorage.kittens = JSON.stringify([]);
            }
        },

        add: function(kitten) {
            var data = JSON.parse(localStorage.kittens);
            data.push(kitten);
            localStorage.kittens = JSON.stringify(data);
        },

        getAllKittens: function() {
            return JSON.parse(localStorage.kittens);
        },

        save: function(kittens) {
            localStorage.kittens = JSON.stringify(kittens);
        },

        incCounter: function(index) {
            var kittens = model.getAllKittens();
            kittens[index].counter++;
            model.save(kittens);
        }
    };

    var controller = {

        init: function() {
            model.init();
            controller.fillInData();
            listView.init();
            photoView.init();
            controller.addEventListeners();
        },

        getAllKittens: function() {
            return model.getAllKittens();
        },

        fillInData: function() {
            for(var i = 1; i <= 5; ++i) {
                model.add({
                    name: 'Kitten ' + i,
                    url: '../images/' + i + '.jpg',
                    counter: 0
                });
            }
        },

        getKittensNumber: function() {
            return model.getAllKittens().length;
        },

        getCurrentKittenIndex: function(name) {
            return model.getAllKittens().map(function(obj, index) {
                if(obj.name == name) {
                    return index;
                }
            }).filter(isFinite)[0];
        },

        addEventListeners: function() {
            var listItems = document.getElementById('kittens-container')
                                    .getElementsByTagName('li');
            var kittens = controller.getAllKittens();
            var img = document.getElementsByClassName('kitten-img')[0];
            var counter = document.getElementsByClassName('counter')[0];

            // Click Event listeners for the list items
            for(var i = 0, len = listItems.length; i < len; ++i) {
                listItems[i].addEventListener('click', function(i) {
                    img.src = kittens[i].url;
                    listView.highlightListItem(kittens[i]);
                    photoView.render(model.getAllKittens()[i]);
                    controller.updateAdminPanel(document.getElementsByTagName('input'));
                }.bind(this, i));
            }

            // Click Event listener for the image
            img.addEventListener('click', function() {
                currentKitten = document.getElementsByClassName('active')[0]
                                        .innerText;

                index = controller.getCurrentKittenIndex(currentKitten);
                model.incCounter(index);

                photoView.render(model.getAllKittens()[index]);

                controller.updateAdminPanel(document.getElementsByTagName('input'));
            });

            // Click Event listener for the Admin button
            document.getElementsByClassName('btn-admin')[0]
              .addEventListener('click', function() {
                var elements = document.getElementsByTagName('input');
                for(var i = 0, len = elements.length; i < len; ++i) {
                    controller.toggleClass(elements[i], 'hidden');
                };
                controller.toggleClass(
                    document.getElementsByClassName('btn-group')[0],
                    'hidden'
                );
                controller.updateAdminPanel(elements);
            });

            controller._addEventListenerToSaveButton();

        },

        getCurrentKitten: function() {
            var currentKitten = document.getElementsByClassName('active')[0]
                                        .innerText;
            index = controller.getCurrentKittenIndex(currentKitten);
            return controller.getAllKittens()[index];
        },

        updateAdminPanel: function(elements) {
            var currentKitten = document.getElementsByClassName('active')[0]
                                        .innerText;
            index = controller.getCurrentKittenIndex(currentKitten);
            if(index || index === 0) {
                var currentKitten = controller.getAllKittens()[index];
                elements[0].value = currentKitten.name;
                elements[1].value = currentKitten.url;
                elements[2].value = currentKitten.counter;
            }
        },

        _addEventListenerToSaveButton: function() {
            var saveBtn = document.getElementsByClassName('btn-save')[0];
            saveBtn.addEventListener('click', function() {
                var currentKittenIndex = controller
                    .getCurrentKittenIndex(document.getElementsByClassName('active')[0]
                                                   .innerText);
                var elements = document.getElementsByTagName('input');
                var name = elements[0].value;
                var kittens = controller.getAllKittens();
                var shouldSave = true;
                for(var i = 0, len = kittens.length; i < len; ++i) {
                    if(kittens[i].name == name && i != currentKittenIndex) {
                        alert('The name "' + name + '" already exists. ' + 
                            'Please find another name.');
                        shouldSave = false
                    }
                };
                if(shouldSave) {
                    kittens[currentKittenIndex].name = name;
                    kittens[currentKittenIndex].url = elements[1].value;
                    kittens[currentKittenIndex].counter = elements[2].value;
                    model.save(kittens);

                    listView.render(model.getAllKittens().length);
                    photoView.init();
                    photoView.render(model.getAllKittens()[currentKittenIndex]);

                    var oldContainer = document.getElementsByClassName('container')[0];
                    var newContainer = oldContainer.cloneNode(true);
                    oldContainer.parentNode.replaceChild(newContainer, oldContainer);
                    controller.addEventListeners();
                }
            });
        },

        toggleClass: function(el, className) {
            if(el.classList) {
                el.classList.toggle(className);
            } else {
                var classes = el.className.split(' ');
                var existingIndex = classes.indexOf(className);

                if(existingIndex >= 0) {
                    classes.splice(existingIndex, 1);
                } else {
                    classes.push(className);
                }

                el.className = classes.join(' ');
            }
        }
    };

    var listView = {

        init: function() {
            listView.render(controller.getKittensNumber());
        },

        render: function(kittensCount) {
            var checkForContainer = document.getElementById('kittens-container');
            var list = document.getElementsByClassName('kittens-list')[0];
            if(list && checkForContainer) {
                checkForContainer.parentNode.removeChild(checkForContainer);
            }

            var kittensContainer = document.createElement('div');
            kittensContainer.id = 'kittens-container';
            document.getElementsByClassName('container')[0]
                    .appendChild(kittensContainer);

            var listElement = document.createElement('ul');
            listElement.className = 'kittens-list';
            kittensContainer.appendChild(listElement);

            var array = controller.getAllKittens();

            // set up a loop to fill the <ul> element with <li>
            for(var i = 0, kittensCount = array.length; i <  kittensCount; ++i){
                // create <li> item
                var kittenItem = document.createElement('li');
                kittenItem.innerHTML = array[i].name;    
                if(i == 0) kittenItem.className = 'active';
                // add <li> to <ul>
                listElement.appendChild(kittenItem);
            }
        },

        highlightListItem: function(kitten) {
            listItems = document.getElementsByClassName('kittens-list')[0]
                                .getElementsByTagName('li');
            var currentKitten = null;
            for(var i = 0, length = listItems.length; i < length; ++i) {
                if (kitten.name === listItems[i].innerText) {
                    listItems[i].style.background = '#1abc9c';
                    listItems[i].style.color = '#fff';
                    listItems[i].className = 'active';
                } else {
                    listItems[i].className = '';
                    listItems[i].style.background = '';
                    listItems[i].style.color = '';
                }
            }
        }
    };

    var photoView = {
        init: function() {
            var checkForPlaceholder = document.getElementsByClassName('photo-placeholder')[0];
            if(checkForPlaceholder) {
                checkForPlaceholder.parentNode.removeChild(checkForPlaceholder);
            }
            // create a div
            var divPlaceholder = document.createElement('div');
            divPlaceholder.className = 'photo-placeholder';
        
            // add the div.photo-placeholder to the kittensContainer
            document.getElementById('kittens-container')
                    .appendChild(divPlaceholder);
        
            // add <img> and <h3> elements to the div. Add
            // the click event listener to <img>
            var img = document.createElement('img');
            img.alt = 'kitten';
            img.className = 'kitten-img';
            img.src = 'http://placehold.it/500x300';
        
            var h3 = document.createElement('h3');
            h3.className = 'counter';
            h3.innerHTML = 'Clicks count = 0';
            divPlaceholder.appendChild(img);
            divPlaceholder.appendChild(h3);
        },

        render: function(kitten) {
            var counter = document.getElementsByClassName('counter')[0];
            var img = document.getElementsByClassName('kitten-img')[0];
            img.src = kitten.url;
            counter.innerText = 'Clicks count = ' + kitten.counter;
        }
    }

    // =============
    // Start the App
    // =============
    controller.init();

})();