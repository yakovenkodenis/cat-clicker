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

            for(var i = 0, len = listItems.length; i < len; ++i) {
                listItems[i].addEventListener('click', function(i) {
                    img.src = kittens[i].url;
                    listView.highlightListItem(kittens[i]);
                    photoView.render(model.getAllKittens()[i]);
                }.bind(this, i));
            }

            img.addEventListener('click', function() {
                currentKitten = document.getElementsByClassName('active')[0]
                                        .innerText;

                index = controller.getCurrentKittenIndex(currentKitten);
                model.incCounter(index);

                photoView.render(model.getAllKittens()[index]);
            });
        }
    };

    var listView = {

        init: function() {
            listView.render(controller.getKittensNumber());
        },

        render: function(kittensCount) {

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
            counter.innerText = 'Clicks count = ' + kitten.counter;
        }
    }

    // =============
    // Start the App
    // =============
    controller.init();

})();