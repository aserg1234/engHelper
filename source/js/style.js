(function(){

    var btnCloseCreateDB = document.querySelector('.btn_close_create_db');
    var btnCloseUseDB = document.querySelector('.btn_close_use_db');   
    var btnCloseSearchInStore = document.querySelector('.btn_close_search_in_store');        
    var btnOpenCreateDbMenu = document.querySelector('.btn_open_create_db');
    var btnOpenChangeDbMenu = document.querySelector('.btn_open_change_db');
    var btnOpenSearchInSoreMenu = document.querySelector('.btn_open_search_in_db');
    // function openNav(){
    //     var openedElement;
    //     if(this.className.contains('btn_open_create_db')){
    //         openedElement = document.querySelector('.createDB_container');
    //     }

    //     if(this.className.contains == 'btn_open_create_db'){
    //         openedElement = document.querySelector('.useDB_container');
    //     }

    //     document.querySelector('.overlay').style.height = "100%";

    //     openedElement.classList.remove('hidden');
    // }
    function openCreateDb(){
        document.querySelector('.overlay_create_db').style.height = "100%";

    }
    function openUseDb(){
        document.querySelector('.overlay_use_db').style.height = "100%";

    }
    function openSearchInStore(){
        document.querySelector('.overlay_search_in_store').style.height = "100%";

    }
    function closeOverlay(){
        document.querySelector('.overlay_create_db').style.height = "0";
        document.querySelector('.overlay_use_db').style.height = "0";
        document.querySelector('.overlay_search_in_store').style.height = "0";        
    }

    function addEventListeners(){

        //закрыть меню создания БД
        btnCloseCreateDB.addEventListener('click', closeOverlay);

        //закрыть меню использования БД
        btnCloseUseDB.addEventListener('click', closeOverlay);   
        
        //закрыть меню поиска в хранилище
        btnCloseSearchInStore.addEventListener('click', closeOverlay);          
        
        //открыть меню создания БД
        btnOpenCreateDbMenu.addEventListener('click', openCreateDb);

        //открыть меню изменения БД
        btnOpenChangeDbMenu.addEventListener('click', openUseDb);

        //открыть меню поиск в хранилище
        btnOpenSearchInSoreMenu.addEventListener('click', openSearchInStore);
        
    }



    addEventListeners();
})();







