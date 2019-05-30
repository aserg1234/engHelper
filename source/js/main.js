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
   var textAreaNewData = document.getElementsByName('newData');
   var btnAddNewDate = document.querySelector('.btn_add_new_date');    
   var btnPreviewNewData = document.querySelector('.btn_preview_new_data');     
   var btnPushNewDate = document.querySelector('.btn_push_new_date'); 

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
   var objStores ={};
   var str = '';
   var current_view_pub_key;

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
         DB_BASIC_STORE_NAME, { keyPath: 'id', autoIncrement: true });
   
         store.createIndex('words', 'words', { unique: true });
         store.createIndex('translate', 'translate', { unique: false });
         store.createIndex('date', 'date', { unique: false });
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
          inpStore[0].value, { keyPath: 'id', autoIncrement: true });

        for(var i in newCategoryObj){
          store.createIndex( i, i, { unique: newCategoryObj[i] });
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

  //выбрать хранилище
  // function selectStore(){
  //   var stores ={};
  //   for(i in db.objectStoreNames){
  //     stores[i] = db.objectStoreNames[i];
  //   }

  // }

  //получение категорий(полей) хранилища для <select>
  function getStoreCat(){
    var req = indexedDB.open(DB_NAME);//, DB_VERSION
    req.onsuccess = function (evt) {
      db = this.result;

          //удаление старых <option>
          var oldOptionsCount = selectStoreCategories[0].childNodes.length;
          for(var i = 0; i < oldOptionsCount; i++){
              selectStoreCategories[0].removeChild(selectStoreCategories[0].childNodes[0]);
          }
          
           //получение категорий(полей) хранилища для <select>
           var categories = db.transaction(selectDbStores[0].value)
             .objectStore(selectDbStores[0].value).indexNames;
           for(var j in categories){
             if( j >= 0){              
               var option = document.createElement('option');//
               option.setAttribute('value', categories[j]);
               option.textContent =  categories[j];
               selectStoreCategories[0].appendChild(option);//               
             }
           }
  
      ////////////////////////////////

      DB_VERSION = this.result.version;
      console.log("openDb DONE");
    };
  }

  //
  function addNewDate(){
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
  function sendData(){
    var req = indexedDB.open(DB_NAME);//, DB_VERSION
    req.onsuccess = function (evt) {
      db = this.result;

          //добавление данных категорий(полей) в хранилище
           db.transaction(selectDbStores[0].value, "readwrite")
             .objectStore(selectDbStores[0].value).add(newDataObj);
      ////////////////////////////////

    };
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
    btnAddNewDate.addEventListener("click", addNewDate);

    //обработка предпросмотр структуры объекта добавляемых данных
    btnPreviewNewData.addEventListener("click", dataObjPreview);     

  }
    //обработка добавление новых данных в объект данных
    btnPushNewDate.addEventListener("click", sendData);



   //////////////////////////////////////////////////////
   //кнопки
  //  var btnNewDate = document.querySelector('.btn_new_date');
  //  btnNewDate.addEventListener('click', sendNewDataInDB);

  //  var btnOldDate = document.querySelector('.btn_old_date');
  //  btnOldDate.addEventListener('click', sendChangeDataInDB);

  //  var btnExerciseDate = document.querySelector('.btn_exercise_date');
  //  btnExerciseDate.addEventListener('click', getRandExercise);

  //  var btnThemeDate = document.querySelector('.btn_theme_date');
  //  btnThemeDate.addEventListener('click', getThemeExercise);

  //  var btnSubmitDecision = document.querySelector('.btn_submit_decision');
  //  btnSubmitDecision.addEventListener('click', sendDecision);


  //  /////////////////////////////////////////////////
 
  //  function sendNewDataInDB(){

  //     // alert('sendNewDataInDB');
  //  }

  //  function sendChangeDataInDB(){

  //  }

  //  function getRandExercise(){

  //  }

  //  function getThemeExercise(){

  //  }

  //  function sendDecision(){

  //  }


   openDb();
   addEventListeners();
})();