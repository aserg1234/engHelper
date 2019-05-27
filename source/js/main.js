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
   var newStore = document.getElementsByName('newStore');
   var btnCreateNewStore = document.querySelector('.btn_createNewStore');
   var pathToDbTheme = document.getElementsByName('pathDbTheme');
   var dataNewForDb = document.getElementsByName('newData');
   var dataOldFromDb = document.getElementsByName('oldData');
   var dataDecisionForDb = document.getElementsByName('decisionData');

   //var jsonDataDB = JSON.parse(base);

   var sendDataJsonDb = {};
   var enterDataJsonDb = {};

   ////////////////////////////////////////////////////
   //
   const DB_NAME = 'engHelper';
   var DB_VERSION = 1; // Use a long long for this value (don't use a float)
   const DB_BASIC_STORE_NAME = 'basicStore';
   const DB_STORE_OF_STORES = {};
   var dbStoreName = '';
   var db;
 
   // Used to keep track of which view is displayed to avoid to uselessly reload it
   var current_view_pub_key;
 
   function openDb() {
     console.log("openDb ...");
//alert(this.result);
     var req = indexedDB.open(DB_NAME);//, DB_VERSION

     req.onsuccess = function (evt) {
       db = this.result;
       DB_VERSION = this.result.version;
alert(this.result.version);       
       console.log("openDb DONE");
alert("ok"+db.version);
     };
     
     req.onerror = function (evt) {
       console.error("openDb:", evt.target.errorCode);
     };
    // версия базы при загрузке     
    //if(db.version > 1){
     // DB_VERSION = db.version;

    //}
 alert(DB_VERSION);  
     req.onupgradeneeded = function (evt) {
alert(DB_VERSION);      
      console.log("openDb.onupgradeneeded");
      var thisDB = evt.target.result;
      if (!thisDB.objectStoreNames.contains(DB_BASIC_STORE_NAME)) {
       var store = thisDB.createObjectStore(
         DB_BASIC_STORE_NAME, { keyPath: 'id', autoIncrement: true });
   
         store.createIndex('biblioid', 'biblioid', { unique: true });
         store.createIndex('title', 'title', { unique: false });
         store.createIndex('year', 'year', { unique: false });
       }
     };

   }
   //
   
   function createNewStore(event) {

      db.close();    

      var req = indexedDB.open(DB_NAME, DB_VERSION+1);     
      req.onsuccess = function (evt) {
        db = this.result;
        console.log("openDb DONE");
      };
      DB_VERSION = db.version;
alert(DB_VERSION);      
//console.dir(db);
      req.onupgradeneeded = function (evt) {
      DB_VERSION += 1;
 alert(DB_VERSION);      
       console.log("openDb.onupgradeneeded");
       var thisDB = evt.target.result;
       //if (!thisDB.objectStoreNames.contains(newStore[0].value)) {
          var store = thisDB.createObjectStore(
            newStore[0].value, { keyPath: 'id', autoIncrement: true });
            
          store.createIndex('biblioid', 'biblioid', { unique: true });
          store.createIndex('title', 'title', { unique: false });
          store.createIndex('year', 'year', { unique: false });
        //}

      };
//
    }


    //обработчики событий
    function addEventListeners(){
     
      //обработка создания нового хранилища
      btnCreateNewStore.addEventListener("click", createNewStore);

    }



   //////////////////////////////////////////////////////
   //кнопки
   var btnNewDate = document.querySelector('.btn_new_date');
   btnNewDate.addEventListener('click', sendNewDataInDB);

   var btnOldDate = document.querySelector('.btn_old_date');
   btnOldDate.addEventListener('click', sendChangeDataInDB);

   var btnExerciseDate = document.querySelector('.btn_exercise_date');
   btnExerciseDate.addEventListener('click', getRandExercise);

   var btnThemeDate = document.querySelector('.btn_theme_date');
   btnThemeDate.addEventListener('click', getThemeExercise);

   var btnSubmitDecision = document.querySelector('.btn_submit_decision');
   btnSubmitDecision.addEventListener('click', sendDecision);


   /////////////////////////////////////////////////
 
   function sendNewDataInDB(){

      // alert('sendNewDataInDB');
   }

   function sendChangeDataInDB(){

   }

   function getRandExercise(){

   }

   function getThemeExercise(){

   }

   function sendDecision(){

   }


   openDb();
   addEventListeners();
})(); // Immediately-Invoked Function Expression (IIFE)