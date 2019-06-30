(function(){

    var btnCloseCreateDB = document.querySelector('.btn_close_create_db');
    var btnCloseUseDB = document.querySelector('.btn_close_use_db');   
    var btnCloseSearchInStore = document.querySelector('.btn_close_search_in_store');        
    var btnOpenCreateDbMenu = document.querySelector('.btn_open_create_db');
    var btnOpenChangeDbMenu = document.querySelector('.btn_open_change_db');
    var btnOpenSearchInSoreMenu = document.querySelector('.btn_open_search_in_db');
    var pSearchResultHeader = document.querySelector('.search_result_header');
    var btnIndRange = document.querySelector('.div_button_index_range'); 
    var btnChooseThemeCat = document.querySelector('.div_button_choose_theme_cat');  
    var btnThemeCatChoiceBlock = document.querySelector('.themeCatChoice_block');        
    //div_button_choose_theme_cat
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
    //открыть/скрыть результаты поиска
    function closeOpenSearchRes(){
        var searchResult = document.querySelector('.found_info_container');
        //console.log(searchResult.classList);

        searchResult.classList.toggle('hidden');


        // if(searchResult.classList.contains == 'hidden'){
        //     searchResult.classList.remove('hidden');
        // }else{
        //     searchResult.classList.add('hidden');            
        // }

    }

    //открыть/скрыть задание диапазона индексов
    function showHideIndRange(){

        this.classList.toggle("active");

        var panel = this.nextElementSibling;//childNodes[1]
        console.dir(this);
  
        if (panel.style.display === "block") {
          panel.style.display = "none";
          //this.style.padding = "10px 0 10px 0";
          btnIndRange.style.width = "50%";  
          btnChooseThemeCat.style.width = "50%";                       
        } else {
          panel.style.display = "block";
          //this.style.padding = "10px 0 0 0";   
          btnIndRange.style.width = "100%";    
          btnChooseThemeCat.style.width = "100%";                
        }
    }

    //открыть/скрыть задание диапазона индексов
    function сhooseThemeCat(){

        this.classList.toggle("active");

        var panel = this.nextElementSibling;
  
        if (panel.style.display === "block") {
          panel.style.display = "none";
          //this.style.padding = "10px 0 10px 0";

          if(btnIndRange.style.width == "100%"){
            btnIndRange.style.width = "100%";            
            btnChooseThemeCat.style.width = "100%"; 
          }else{
            btnIndRange.style.width = "50%";  
            btnChooseThemeCat.style.width = "50%";             
          }


        } else {
          panel.style.display = "block";
          //this.style.padding = "10px 0 0 0";  
          btnIndRange.style.width = "100%";    
          btnChooseThemeCat.style.width = "100%";                       
        }
    }

    function showHideThemeCatChoice(){
        this.classList.toggle("active");

        var panel = this.nextElementSibling;
  
        if (panel.style.display === "block") {
          panel.style.display = "none";
          //this.style.padding = "10px 0 10px 0";
        } else {
          panel.style.display = "block";
          //this.style.padding = "10px 0 0 0";            
        }
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

        //проказать/скрыть результаты поиска
        pSearchResultHeader.addEventListener('click',closeOpenSearchRes);

        //
        btnThemeCatChoiceBlock.addEventListener('click',showHideThemeCatChoice);
        
        //проказать/скрыть выбор диапазона заданий
        btnIndRange.addEventListener('click', showHideIndRange);

        //показать скрыть выбор темы заданий(только для тематич задания)
        btnChooseThemeCat.addEventListener('click', сhooseThemeCat);


        
    }



    addEventListeners();
})();







