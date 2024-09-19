class ProductPopup {
  constructor() {
    this.variantJson = null;
    this.optionObj = {};
    this.variantId = 0;
    this.colorOptionIndex = null;
    this.variantIndex = null;
  }

  initialize() {
    document.querySelectorAll('.custom-quick-add').forEach((item) => {
      item.addEventListener('click', async (evt) => {
        let productJSON = JSON.parse(item.dataset.json);
        this.showPopup(productJSON);
      });
    });

    document.body.addEventListener('click', (event) => {
      if(event.target.closest("#variant-wrapper") == null) return;
      let data_index = event.target.dataset.index;
      console.log(document.querySelector(`.select-dropdown__list.option_${data_index}`),data_index);
      if (event.target.classList.contains(`option_${this.colorOptionIndex}`)) {
        this.optionObj[`option_${this.colorOptionIndex}`] = event.target.value;
        this.variantId = this.findMatchingId(this.variantJson, this.optionObj);
        console.log(this.optionObj, event.target.value, this.variantJson, this.variantId);
      } else if (event.target.classList.contains(`option_${data_index}`)) {
        console.log("current target",this.target);
        this.optionObj[`option_${data_index}`] = event.target.dataset.value;
        this.variantId = this.findMatchingId(this.variantJson, this.optionObj);
        document.querySelector(`.select-dropdown__list.option_${data_index}`).classList.toggle('active');
        document.querySelector(`.select-dropdown__button.option_${data_index} span`).innerText = event.target.dataset.value;
        console.log(this.optionObj, event.target.dataset.value, this.variantJson, this.variantId);
      } 
    });
  }

  showPopup(productJSON) {
    // Display product popup with details
    document.querySelector(".variant-wrapper").innerHTML ="";
    document.querySelector('.addToCart').disabled = true;
    document.querySelector('#product--image').src = productJSON.featured_image;
    document.querySelector('.product_title').innerText = productJSON.title;
     document.querySelector('.product_price').innerText = (productJSON.price / 100).toFixed(2);
    document.querySelector('.product_description').innerHTML = productJSON.description;
    document.querySelector("#popup").style.display = 'grid';
    console.log(productJSON.options.length,productJSON.options);
    if(productJSON.options.length == 1){
      this.checkVariantAvailibility(productJSON.variants[0]);
      return;
    }
    this.createElementsFromArray(productJSON.options);
    this.variantJson = productJSON.variants;
    this.createProductElements(productJSON.variants);
  }

  createElementsFromArray(array) {
    array.forEach((item, index) => {
      if(document.getElementById(`option_${index + 1}`)) document.getElementById(`option_${index + 1}`).remove();
      const optionWrapper = document.createElement('div');
      optionWrapper.id = `option_${index + 1}`;
      optionWrapper.classList.add(`option_${item}`);
      optionWrapper.dataset.name = item;
      optionWrapper.innerHTML = `<h3>${item}</h3>`;
      document.querySelector('.variant-wrapper').appendChild(optionWrapper);
    });
  }

  createProductElements(variants) {
    const options = [new Set(), new Set(), new Set()];

    variants.forEach(item => {
      if (item.option1) options[0].add(item.option1);
      if (item.option2) options[1].add(item.option2);
      if (item.option3) options[2].add(item.option3);
    });

    options.forEach((item, index) => this.parsingHtml(item, index));
  }

  parsingHtml(optionValue, index) {
    if (optionValue.size === 0) return;

    let optionName = document.getElementById(`option_${index + 1}`);
    let variantWrapper,select_dropdown;

    if (optionName.classList.contains("option_Color") == true || optionName.classList.contains("option_color")) {
      this.colorOptionIndex = index + 1;
      variantWrapper = document.createElement('div');
      variantWrapper.id = `variant_${index}`;
      variantWrapper.classList.add("variant-option_color");
    } else {
      select_dropdown = document.createElement('div');
      select_dropdown.classList.add('select-dropdown');
      variantWrapper = document.createElement('ul');
      variantWrapper.classList.add(`option_${index + 1}`);
      variantWrapper.classList.add(`select-dropdown__list`);
      variantWrapper.id = `variant_${index}`;
      select_dropdown.innerHTML = `<button data-index="${index + 1}" href="#" role="button" data-value="" class="option_${index + 1} select-dropdown__button"><span>Choose your ${optionName.dataset.name}</span> 
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="20" width="20" version="1.1" id="Layer_1" viewBox="0 0 330.002 330.002" xml:space="preserve">
        <path id="XMLID_229_" d="M327.001,99.751c-4.971-6.628-14.374-7.971-21-3l-140.997,105.75L24.001,96.751  c-6.628-4.971-16.029-3.626-21,3c-4.971,6.627-3.627,16.03,3,21l150.004,112.5c2.667,2,5.833,3,9,3c3.166,0,6.333-1,9-3  l149.996-112.5C330.628,115.781,331.972,106.379,327.001,99.751z"/>
      </svg>
      </button>`;
    }

    let optionValueCount = 1;
    optionValue.forEach(value => {
      if (optionName.classList.contains("option_Color") == true || optionName.classList.contains("option_color")) {
        variantWrapper.innerHTML += `
          <input type="radio" name="${optionName.dataset.name}" data-id="tabs-${optionValueCount}" id="${value}_${index}" class="option_${index + 1} variant hidden" value="${value}" />
          <label for="${value}_${index}">${value} <span class="select-bg ${value}" style="position: absolute;left: 0; top: 0;height: 100%;width: 5px;background: ${value}; border-right: 1px solid #000;"></span></label>
          
        `;
      } else {
        const optionElement = document.createElement('li');
        optionElement.textContent = value;
        optionElement.dataset.value = value;
        optionElement.dataset.index = index + 1;
        optionElement.classList.add(`option_${index + 1}`);
        variantWrapper.appendChild(optionElement);
      }
      optionValueCount++;
    });
    
    if(optionName.classList.contains("option_Color") == true || optionName.classList.contains("option_color")){
      const glider = document.createElement('div');
      glider.classList.add("glider");
      variantWrapper.appendChild(glider);
      optionName.appendChild(variantWrapper);
    }else{
      select_dropdown.appendChild(variantWrapper);
      optionName.appendChild(select_dropdown);
    }
    console.log(optionValue, index);
  }

  findMatchingId(variantObj, selectedVariantObj) {
    for (let i = 0; i < variantObj.length; i++) {
      if (variantObj[i].option1 === selectedVariantObj.option_1 && variantObj[i].option2 === selectedVariantObj.option_2 && variantObj[i].option3 === selectedVariantObj.option_3) {
         this.checkVariantAvailibility(variantObj[i]);
      }else if (variantObj[i].option1 === selectedVariantObj.option_1 && variantObj[i].option2 === selectedVariantObj.option_2 && variantObj[i].option3 == null) {
         this.checkVariantAvailibility(variantObj[i]);
      }
    }
  }

  checkVariantAvailibility(variant){
     if (variant.available) {
          document.getElementById('product-variant-id').value = variant.id;
          document.querySelector('.addToCart').disabled = false;
          document.querySelector('.error').classList.add('hidden');
        } else {
          document.querySelector('.addToCart').disabled = true;
          document.querySelector('.error').classList.remove('hidden');
        }
  }
}

 function hidePopup() {
    document.querySelector("#popup").style.display = 'none';
  }
const productPopup = new ProductPopup();
productPopup.initialize();

const number = [1,2,3,4];
console.log("test",number);
    for(i = number.length; i = 0; i-- ){
      console.log([i]);
    }




