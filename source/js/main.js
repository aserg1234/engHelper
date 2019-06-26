(function () {
	// проверяем существования префикса.
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	// НЕ ИСПОЛЬЗУЙТЕ "var indexedDB = ..." вне функции.
	// также могут отличаться и window.IDB* objects: Transaction, KeyRange и тд
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	// (Mozilla никогда не создавала префиксов для объектов, поэтому window.mozIDB* не требуется проверять)
	if(!window.indexedDB){
		window.alert("Ваш браузер не поддерживает стабильную версию IndexedDB");
   }

   ///////////////////////////////////////////////
   //глобальные переменные
   var inpStore = document.getElementsByName('inpStore');
   var btnCreateNewStore = document.querySelector('.btn_createNewStore');
   var btnDeleteStore = document.querySelector('.btn_deleteStore');
   var btnAddNewCat = document.querySelector('.btn_addNewCat');  
   var btnDelNewCat = document.querySelector('.btn_delNewCat');     
   var newCategory = document.getElementsByName('newCategory');
   var uniqueCategory = document.getElementsByName('uniqueCategory');
   var btnPreview = document.querySelector('.btn_preview');     
   var selectDbStores = document.getElementsByName('dbStores');
   var btnSelectStore = document.querySelector('.btn_selectStore');
   var selectStoreCategories = document.getElementsByName('storeCategories');
   var selectCatThemeForTask = document.getElementsByName('catThemeForTask'); 
   var themeForTask =  document.getElementsByName('themeForTask'); 
   var taskCategory = document.getElementsByName('catForTask');
   var selectStoreCategoriesAnswer = document.getElementsByName('storeCategoriesAnswer');
   var textAreaNewData = document.getElementsByName('newData');
   var btnAddNewData = document.querySelector('.btn_add_new_data');    
   var btnPreviewNewData = document.querySelector('.btn_preview_new_data');     
   var btnPushNewData = document.querySelector('.btn_push_new_data'); 
   var textAreaOldData = document.getElementsByName('oldData');
   var btnChangeData = document.querySelector('.btn_change_data'); 
   var btnDeleteData = document.querySelector('.btn_delete_data'); 
   var btnDataFromFile = document.querySelector('input[type=file]');
   var btnSaveDataToFile = document.querySelector('.btn_save_data_to_file');
   var btnThemeData = document.querySelector('.btn_theme_data');     
   var btnAlThemeData = document.querySelector('.btn_all_theme_data');   
   var btnExerciseData = document.querySelector('.btn_exercise_data');   
   //
   var btnSubmitDecision = document.querySelector('.btn_submit_decision');

   var btnFileData = document.querySelector('.btn_file_data');    
   var btnChangeDataByhand = document.querySelector('.btn_change_data_byhand');   

   //var jsonDataDB = JSON.parse(base);

   var sendDataJsonDb = {};
   var enterDataJsonDb = {};
    

   ////////////////////////////////////////////////////
   //
   const DB_NAME = 'engHelper';
   var DB_VERSION = 1; 
   const DB_BASIC_STORE_NAME = 'basicStore';
   const DB_STORE_OF_STORES = {};
   var dbStoreName = '';
   var db;
   var newCategoryObj = {};
   var newDataObj = {};
   var newDataFromFileObl ={};

   var answerDataObj = {};
 

   //создание базы данных и базового хранилища + создание списка хранилищ
   function openDb() {
     console.log("openDb ...");
     var req = indexedDB.open(DB_NAME);//, DB_VERSION
     req.onsuccess = function (evt) {
       db = this.result;

       //получение имен хранилищ в базе
       //и создание options
       for(var i in db.objectStoreNames){
          if( i >= 0 ){
            var option = document.createElement('option');//
            option.setAttribute('value', db.objectStoreNames[i]);
            option.textContent =  db.objectStoreNames[i];
            selectDbStores[0].appendChild(option); 

            //получение категорий(полей) хранилища для <select>
            var categories = db.transaction(selectDbStores[0].value)
              .objectStore(selectDbStores[0].value).indexNames;
            for(var j in categories){
              if( j >= 0 && db.objectStoreNames[i] == selectDbStores[0].value){              
                var option = document.createElement('option');//
                option.setAttribute('value', categories[j]);
                option.textContent =  categories[j];
                selectStoreCategories[0].appendChild(option);//               
              }
            }
          
          } 
        }       
       ////////////////////////////////

       DB_VERSION = this.result.version;
       console.log("openDb DONE");
     };

     req.onerror = function (evt) {
       console.error("openDb:", evt.target.errorCode);
     };

     req.onupgradeneeded = function (evt) {     
      console.log("openDb.onupgradeneeded");
      var thisDB = evt.target.result;
      if (!thisDB.objectStoreNames.contains(DB_BASIC_STORE_NAME)) {
       var store = thisDB.createObjectStore(
         DB_BASIC_STORE_NAME, { keyPath: 'basicStore_id', autoIncrement: true });

         store.createIndex('theme', 'theme', { unique: false });   
         store.createIndex('speciality', 'speciality', { unique: false });            
         store.createIndex('words', 'words', { unique: false });
         store.createIndex('translate', 'translate', { unique: false });
         //store.createIndex('date', 'date', { unique: false });
       }
     };

   }
   //
   //добарить новое хранилище
   function createNewStore() {
      db.close(); 
       
      var req = indexedDB.open(DB_NAME, DB_VERSION+1);     
      req.onsuccess = function (evt) {
        db = this.result;
        console.log("openDb DONE");
      };

      DB_VERSION = db.version;
      req.onupgradeneeded = function (evt) {
        DB_VERSION += 1;
        console.log("openDb.onupgradeneeded");
        var thisDB = evt.target.result;
        //if (!thisDB.objectStoreNames.contains(inpStore[0].value)) {
        var store = thisDB.createObjectStore(
          inpStore[0].value, { keyPath: inpStore[0].value+'_id', autoIncrement: true });

        for(var i in newCategoryObj){
          if(newCategoryObj[i] == 'true') newCategoryObj[i] = true;
          else if(newCategoryObj[i] == 'false')  newCategoryObj[i] = false;

          store.createIndex( i, i, { unique:  newCategoryObj[i] } );
        }

      };
    }

   //удалить хранилище
   function deleteStore() {
    db.close();    
    var req = indexedDB.open(DB_NAME, DB_VERSION+1);     
    req.onsuccess = function (evt) {
      db = this.result;
      console.log("openDb DONE");
    };
 
    DB_VERSION = db.version;
    req.onupgradeneeded = function (evt) {

      DB_VERSION += 1;
      console.log("openDb.onupgradeneeded");
       var thisDB = evt.target.result;
       thisDB.deleteObjectStore(inpStore[0].value);
      };

  }   

  //добавить категорию(поле)
  function addCategory(){
    newCategoryObj[newCategory[0].value] = uniqueCategory[0].value;//
    newCategory[0].value = '';
    uniqueCategory[0].value = '';
    
  }

  //удалить категорию(поле)
  function delCategory(){
    for(var i in newCategoryObj){
      if(i == newCategory[0].value){
        delete newCategoryObj[i];
      }
    }
  }  
  //предпросмотр добавляемых категорий хранилища
  function storePreview(){
    var str = '';
    for(var  i in newCategoryObj){
      str += "категория: " + i + " = уникальнось: " + newCategoryObj[i] + " \n";
    }  
    alert(str);  
  }

  //получение категорий(полей) хранилища для <select>
  function getStoreCat(){

    var req = indexedDB.open(DB_NAME);//, DB_VERSION
    req.onsuccess = function (evt) {
      db = this.result;

          //удаление поля темы
          themeForTask[0].value = '';

          //удаление старых <option> theme
          var oldOptionsCountTheme = selectCatThemeForTask[0].childNodes.length;
          for(var i = 0; i < oldOptionsCountTheme; i++){
            selectCatThemeForTask[0].removeChild(selectCatThemeForTask[0].childNodes[0]);                                          
          }

          //удаление старых <option>
          var oldOptionsCount = selectStoreCategories[0].childNodes.length;
          for(var i = 0; i < oldOptionsCount; i++){
              selectStoreCategories[0].removeChild(selectStoreCategories[0].childNodes[0]);                                          
          }
          //удаление старых <option> exercise   
          var oldOptionsCountTask = taskCategory[0].childNodes.length;
          for(var i = 0; i < oldOptionsCountTask; i++){              
              taskCategory[0].removeChild(taskCategory[0].childNodes[0]);                            
          }
          
          //удаление старых <option> Answer
          var oldOptionsCountAnswer = selectStoreCategoriesAnswer[0].childNodes.length;
          for(var i = 0; i < oldOptionsCountAnswer; i++){            
            selectStoreCategoriesAnswer[0].removeChild(selectStoreCategoriesAnswer[0].childNodes[0]);
          }          
           //получение категорий(полей) хранилища для <select>
           var categories = db.transaction(selectDbStores[0].value)
             .objectStore(selectDbStores[0].value).indexNames;
           for(var j in categories){
             if( j >= 0){           
              var option4 = document.createElement('option');//                  
               var option = document.createElement('option');//
               var option2 = document.createElement('option');//
               var option3 = document.createElement('option');//

               option4.setAttribute('value', categories[j]);
               option4.textContent =  categories[j];               

               option.setAttribute('value', categories[j]);
               option.textContent =  categories[j];

               option2.setAttribute('value', categories[j]);
               option2.textContent =  categories[j];

               option3.setAttribute('value', categories[j]);
               option3.textContent =  categories[j]; 
                            
               selectCatThemeForTask[0].appendChild(option4);//
               selectStoreCategories[0].appendChild(option);//
               taskCategory[0].appendChild(option2);     
               selectStoreCategoriesAnswer[0].appendChild(option3);//                
             }
           }
  
      //////////

      DB_VERSION = this.result.version;
      console.log("openDb DONE");
    };
  }

  //
  function addNewData(){
    newDataObj[selectStoreCategories[0].value] = textAreaNewData[0].value.trim();//
    textAreaNewData[0].value = '';

  }
  //предпросмотр добавляемых данных(объект) в хранилище
  function dataObjPreview(){

    var str = '';
    for(var  i in newDataObj){
      str += i + " : " + newDataObj[i] + " \n";

    }  
    console.dir(newDataObj);  
  }

  //добавление данных в хранилище
  function sendData(obj){
    var req = indexedDB.open(DB_NAME);//, DB_VERSION
    req.onsuccess = function (evt) {
      db = this.result;

      var objectStore  = db.transaction(selectDbStores[0].value, "readonly")
      .objectStore(selectDbStores[0].value);

      var storeRange = 0;
      var countRequest = objectStore.count();

        countRequest.onsuccess = function(){

        storeRange = countRequest.result;
          console.log(storeRange);

      }


      
      //добавление данных категорий(полей) в хранилище
      db.transaction(selectDbStores[0].value, "readwrite")
        .objectStore(selectDbStores[0].value).add(obj);  

    };
  }

  //изменение данных
  function changeData(){
    var req = indexedDB.open(DB_NAME);//, DB_VERSION
    req.onsuccess = function (evt) {
      db = this.result;
      var cur = db.transaction(selectDbStores[0].value, "readwrite")
        .objectStore(selectDbStores[0].value).openCursor();
      cur.onsuccess = function(e){
          var cursor = e.target.result;
          if(cursor){

            if(cursor.value[selectStoreCategories[0]
              .value] === textAreaOldData[0].value.trim()){

              var updateData = cursor.value;
              updateData[selectStoreCategories[0]
              .value] = textAreaNewData[0].value.trim();

              var request = cursor.update(updateData);
              // request.onsuccess = function(){
              //   console.log('aaaa');
              // };

            }
            cursor.continue();
          } 
      }
     
    };

  }

  //удаление данных из хранилища
  function removeData(){

    var newCounter = 1;

    var req = indexedDB.open(DB_NAME);//, DB_VERSION
    
    req.onsuccess = function (evt) {
      db = this.result;
      
      var cur = db.transaction(selectDbStores[0].value, "readwrite")
        .objectStore(selectDbStores[0].value).openCursor(); 

      var str = '';
        
      cur.onsuccess = function(e){
          var cursor = e.target.result;

          if(cursor){

       
            if(cursor.value[selectStoreCategories[0]
              .value] === textAreaOldData[0].value.trim()){
                
              cursor.delete();

            }
            //переиндексирую поле id элемента
            cursor.value[selectDbStores[0].value+'_id'] = newCounter++;

            // str += cursor.value.words + ": " +  cursor.value[selectDbStores[0].value+'_id'] + "; ";
            console.dir(cursor);
            cursor.continue();
          }else{

          }
      }
    
    };
  }

  //чтение файла и отправка записей в БД
  //учитывать допустимое колво итераций в браузере
  //если проблема--то сделать счетчик на каждом цикле
  //считающий все итерации--на макс - преостановка и далее...  
  function readOwnFile(){
    var file = document.querySelector('input[type=file]').files[0];	
    var reader = new FileReader();
    

    reader.onloadend = function () {

      //массив записей(не очищен)
      var textToArr = reader.result;  
      textToArr = textToArr.split(';');

      for(var i=0; i<textToArr.length; i++){

        //поля одного объекта и значения
        var objFields = textToArr[i].split('|'); 

        //объект для сохр новой(чистой) записи
        var cleanNoteObj = {};
    
        for(var j = 0; j < objFields.length; j++){

          //одно поле и значение
          var oneField = objFields[j].split(":");

          //массив ключ[0], значение[1]
          var arrOneFieldNew = [];
          //итерация очищения всех лишних пробелов(на ключах и значениях)
          for(var k = 0; k < 2; k++){
            
            arrOneFieldNew[k] = oneField[k].trim();

          }

          //очищенная одна запись(объект) готовая к отправке          
          cleanNoteObj[arrOneFieldNew[0]] = arrOneFieldNew[1];
          
          //проверка файла на корректность
          if( i == 0 && !checkDataFromFile(arrOneFieldNew[0]) ) {
            alert('днанные в файле не подходят для выбранного хранилища');
            return;
          }      
        }
        //отправка записи(объекта) в базу данных
        sendData(cleanNoteObj);
         
      }
 
    }

    if (file) {
      reader.readAsText(file, 'utf-8');
    } else {

    }
  }
  //сравнение ключей файла с категориями базы (только для функции readOwnFile)
  function checkDataFromFile(cat){
    var storeCategories = document.getElementsByName('storeCategories')[0].children;
    
    var count = 0;
    for(i = 0; i < storeCategories.length; i++){

      if(cat == storeCategories[i].value){
        count++;
      }
    }

    if(!count){
      return  false;    
    }
    return true;
  }

  //сохранить хранилище в файл
  function saveDataForFile(){
  
    var req = indexedDB.open(DB_NAME);//, DB_VERSION
    
    var fileStr = '';

    var aSendDataToFile = document.querySelector('.a_send_file');

    req.onsuccess = function (evt) {

      db = this.result;

      var cur = db.transaction(selectDbStores[0].value, "readwrite")
        .objectStore(selectDbStores[0].value).openCursor();
      
      cur.onsuccess = function(e){
          
          var cursor = e.target.result;
          
          if(cursor){

            fileStr += JSON.stringify(cursor.value);
       
            cursor.continue();

          }else{

           var textObj = new Blob([fileStr], { type: 'text/plain' } );  
          console.dir(fileStr);          
            aSendDataToFile.href = URL.createObjectURL(textObj);
            var date = new Date();

            var day = date.getDate();
            if(day <10) day = '0'+day;
            
            var month = date.getMonth();
            if(month<10) month = '0'+ month;

            var year = date.getFullYear();
        
            aSendDataToFile.download = "" + selectDbStores[0].value + "_" +
            day + "." + month + "." + year + ".txt";
            window.URL.revokeObjectURL(textObj);
          }
          
      }

    }; 

  }

  //получить задание по всем темам
  function getAllThemeData(){


    //очищаем поле - старое решение
    var decisionData = document.getElementsByName('decisionData')[0];
    decisionData.value = '';
  
    var req = indexedDB.open(DB_NAME);//, DB_VERSION

    var taskCategory = document.getElementsByName('catForTask')[0].value;
    var dataTask = document.querySelector('.request_data_exercise');

    

    req.onsuccess = function (evt) {

      db = this.result;

      //количество записей в базе
      var objectStore  = db.transaction(selectDbStores[0].value, "readonly")
      .objectStore(selectDbStores[0].value);

      var storeRange = 0;
      var randId;

      var countRequest = objectStore.count();

//console.log(objectStore.count());     

      countRequest.onsuccess = function(){

        storeRange = countRequest.result;
        console.log("количество записей в хранилище: " + storeRange);

        randId = chooseRandTask(storeRange);
      }

      //курсор поиск задания
      var cur = db.transaction(selectDbStores[0].value, "readwrite")
        .objectStore(selectDbStores[0].value).openCursor();
var themeObj = [];         
var j = 0;
      cur.onsuccess = function(e){
        
//console.log(j++);        
        var cursor = e.target.result;
         
        if(cursor){

          var data = cursor.value;
     
            if(cursor.value[selectCatThemeForTask[0].value] == themeForTask[0].value){
                themeObj[j++] = data;
                //console.log(data);
                console.dir(themeObj[j-1]);//
            }

            if( cursor.value[selectDbStores[0].value+'_id'] == randId ){
              
              dataTask.textContent = data[taskCategory];
              // console.dir(data[taskCategory] + "; рэнд = " +  randId);
              // console.dir(cursor.value[selectDbStores[0].value+'_id']);
              //if(taskCategory == 'words') {
                //resStr += cursor.value[ e.target.source.indexNames[i] ];

                //заполняю глоб объект данными из выбранной записи
                for(var i in data ){
                  answerDataObj[i] = cursor.value[i];
                  //console.log(i);   
                  //console.dir(answerDataObj[i]);               
                }

                //answerData.textContent = cursor.value;//.translate 
                //answerData.textContent = resStr;
                //debugger
                
              //}else{
                //answerData.textContent = cursor.value.words;
              //}

                            
            }

              cursor.continue();

          }else{

          }

      }

    }; 
    hideDecision();
//console.dir(answerDataObj.length);
  }

  //получение тематического задания
  function getThemeData(){

    //очищаем поле - старое решение
    var decisionData = document.getElementsByName('decisionData')[0];
    decisionData.value = '';
  
    var req = indexedDB.open(DB_NAME);//, DB_VERSION

    var taskCategory = document.getElementsByName('catForTask')[0].value;
    var dataTask = document.querySelector('.request_data_exercise');
    var answerData = document.querySelector('.answer_data');


    req.onsuccess = function (evt) {

      db = this.result;

      //количество записей в базе
      var objectStore  = db.transaction(selectDbStores[0].value, "readonly")
      .objectStore(selectDbStores[0].value);

      var storeRange = 0;
      var randId;

      var countRequest = objectStore.count();

      countRequest.onsuccess = function(){

        storeRange = countRequest.result;
        console.log("количество записей в хранилище: " + storeRange);

        randId = chooseRandTask(storeRange);
      }

      //курсор поиск задания
      var cur = db.transaction(selectDbStores[0].value, "readwrite")
        .objectStore(selectDbStores[0].value).openCursor();

      cur.onsuccess = function(e){

          var cursor = e.target.result;
          
          if(cursor){

            var data = cursor.value;

            if(cursor.value[selectDbStores[0].value+'_id'] == randId){
              
              dataTask.textContent = data[taskCategory];
              // console.dir(data[taskCategory] + "; рэнд = " +  randId);
              // console.dir(cursor.value[selectDbStores[0].value+'_id']);
              //if(taskCategory == 'words') {
                //resStr += cursor.value[ e.target.source.indexNames[i] ];
                for(var i in data ){
                  answerDataObj[i] = cursor.value[i];
                  //console.log(i);                  
                }

                //answerData.textContent = cursor.value;//.translate 
                //answerData.textContent = resStr;
                //debugger
                
              //}else{
                //answerData.textContent = cursor.value.words;
              //}

                            
            }

              cursor.continue();

          }else{

          }
          
          //console.log(fileStr);
      }
      //answerData.textContent = resStr;
    }; 
    hideDecision();
  }

  //
  function chooseRandTask(max){

      var rand = 1 - 0.5 + Math.random() * (max - 1 + 1)
      rand = Math.round(rand); 

      //console.log(rand);

      return rand;
  }
  //
  function sendDecision(){

    // var decisionData = document.getElementsByName('decisionData')[0];
    // decisionData.value = '';

    var answerData = document.querySelector('.answer_data');  
    answerData.classList.remove('hidden');

    answerData.textContent = answerDataObj[selectStoreCategoriesAnswer[0].value];

    //var resultData = document.querySelector('.result_data');

    //resultData.textContent = decisionData.value;

  }

  //
  function hideDecision(){
    var answerData = document.querySelector('.answer_data');  
    answerData.classList.add('hidden');    
  }

  //получить задание из всей базы(случайно)
  function getDBExerciseData(randStore){

    var req = indexedDB.open(DB_NAME);//, DB_VERSION

    var randStore = randStore;

    console.log(randStore);    

    var taskCategory = document.getElementsByName('catForTask')[0].value;
    var dataTask = document.querySelector('.request_data_exercise');
    var answerData = document.querySelector('.answer_data');

    req.onsuccess = function (evt) {

      db = this.result;

      //количество записей в базе
      var objectStore  = db.transaction(randStore, "readonly")
      .objectStore(randStore);

      var storeRange = 0;
      var randId;

      var countRequest = objectStore.count();

      countRequest.onsuccess = function(){

      storeRange = countRequest.result;

     
        console.log("количество записей в хранилище: " + storeRange);

        randId = chooseRandTask(storeRange);
      }
      
      //курсор поиск задания
      var cur = db.transaction(randStore, "readwrite")
        .objectStore(randStore).openCursor();
      
      cur.onsuccess = function(e){

          var cursor = e.target.result;
          
          if(cursor){

            var data = cursor.value;    

            if(cursor.value[randStore+'_id'] == randId){
              dataTask.textContent = data[taskCategory];

              if(taskCategory == 'words')

                answerData.textContent = cursor.value.translate; 

              else answerData.textContent = cursor.value.words;

            }

              cursor.continue();

          }else{

          }
      }
    }; 
    hideDecision();
  }

  //получить хранилище случайно
  function getRandomStoreNum(){

    //очищаем поле- прошлое решение
    var decisionData = document.getElementsByName('decisionData')[0];
    decisionData.value = '';

    var randDBStore;

    var req = indexedDB.open(DB_NAME);//, DB_VERSION

    req.onsuccess = function (evt) {

      db = evt.target.result;

      randDBStore = chooseRandTask(db.objectStoreNames.length);//
      //console.dir(db.objectStoreNames[randDBStore]);
    }

      var timer = setInterval(function(){

        if(randDBStore !== undefined) {
          console.log(randDBStore);
          getDBExerciseData(db.objectStoreNames[randDBStore-1]);
          clearInterval(timer);
        }
      }, 1000);
   
  }
  //getRandomStoreNum();

  //открыть меню для работы с файлами
  function openMenuWorkFile(){
    var menu = document.querySelector('.data_from_file');
    menu.classList.toggle('hidden');
  }
  //открыть меню для работы с данными вручную
  function openMenuChangeData(){
    var menu = document.querySelector('.change_data');
    menu.classList.toggle('hidden');
  }



  /////////////////////////////////////////////////////////////// 
  //обработчики событий
  function addEventListeners(){
    
    //обработка создания нового хранилища
    btnCreateNewStore.addEventListener("click", createNewStore);

    //обработка удаления хранилища
    btnDeleteStore.addEventListener("click", deleteStore);

    //обработка добавление новой категории
    btnAddNewCat.addEventListener("click", addCategory);

    //обработка удаление новой категории
    btnDelNewCat.addEventListener("click", delCategory);  
    
    //обработка предпросмотр структуры хранилища
    btnPreview.addEventListener("click", storePreview);        

    //обработка выбрать хранилище
    btnSelectStore.addEventListener("click", getStoreCat);  

    //обработка добавление новых данных в объект данных
    btnAddNewData.addEventListener("click", addNewData);

    //обработка предпросмотр структуры объекта добавляемых данных
    btnPreviewNewData.addEventListener("click", dataObjPreview);     

  
    //обработка добавление новых данных в объект данных
    btnPushNewData.addEventListener("click", function(){
      sendData(newDataObj);
    });

    //обработка изменение старых данных в хранилище
    btnChangeData.addEventListener("click", changeData);

    //обработка изменение старых данных в хранилище
    btnDeleteData.addEventListener("click", removeData);
    
    //обработка прочитать данные из файла и отправить в хранилище
    btnDataFromFile.addEventListener("change", readOwnFile);

    //обработка сохранить данные для файла
    btnSaveDataToFile.addEventListener("click", saveDataForFile);

    //обработка получить задание по всем темам
    btnAlThemeData.addEventListener("click", getThemeData);
    
    //обработка получить тематическое задание
    btnThemeData.addEventListener("click", getAllThemeData);

    //обработка  получить задание из всей базы
    btnExerciseData.addEventListener("click", getRandomStoreNum);

    //обработка отправить решение
    btnSubmitDecision.addEventListener("click", sendDecision);   

    //обработка вызвать меню для работы с данными из файла
    btnFileData.addEventListener("click", openMenuWorkFile); 

    //обработка вызвать меню для изменения данных в ручную
    btnChangeDataByhand.addEventListener("click", openMenuChangeData);     

  }
   //////////////////////////////////////////////////////

   openDb();
   addEventListeners();
})();