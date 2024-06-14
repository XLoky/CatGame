'use strict';

let actualCharacteristic;
let leftCatName;
const characteristics = [];
let apiInfo;
let i = 0;
let score = 0;
let highScore = localStorage.getItem('catHighScore') ?? 0;

document.querySelector('.vs').style.left = `${window.innerWidth / 2 - document.querySelector('.vs').clientWidth / 2}px`;
addEventListener('resize',()=>{
    document.querySelector('.vs').style.left = `${window.innerWidth / 2 - document.querySelector('.vs').clientWidth / 2}px`;
})

const vsBad = () => {
    document.querySelector('.vs__aux').classList.add('vsBad');
    document.querySelector('.vs__aux').innerHTML += '<i class="fa-solid fa-xmark"></i>';
    setTimeout(() => {
        document.querySelector('.vs__aux > i').classList.add('popUp')
        setTimeout(() => {
            document.querySelector('.start-fade > *').style.opacity = 1;
            document.querySelector('.start-fade').classList.remove('fadeOut');
            document.querySelector('.start-fade').style.opacity = 0;
            document.querySelector('.start-fade').style.backgroundColor = '#222';
            document.querySelector('.start-fade').classList.add('fadeIn');
            document.querySelector('.start-fade').style.pointerEvents = 'all'
        }, 1000);
    }, 1000);
}
const vsGood = (i, api) => {
    score++;
    document.querySelector('.score').innerHTML = `Score: ${score}`;

    if(score > highScore){
        localStorage.setItem('catHighScore', score)
        document.querySelector('.record').innerHTML = `High Score: ${score}`;
    }

    actualCharacteristic = characteristics[Math.floor(Math.random() * 22)][0];

    console.log(api[i - 1].breeds[0][actualCharacteristic])
    while(!api[i - 1].breeds[0][actualCharacteristic] || !api[i].breeds[0][actualCharacteristic]){
        actualCharacteristic = characteristics[Math.floor(Math.random() * 22)][0];
    }

    i = generateRightPost(i, api);
    document.querySelector('.vs__aux').classList.add('vsGood');
    document.querySelector('.vs__aux').innerHTML += '<i class="fa-solid fa-check"></i>';
    setTimeout(() => {
        document.querySelector('.vs__aux > i').classList.add('popUp')
        setTimeout(() => {
            document.querySelector('.vs').classList.add('unPopUp');
            setTimeout(() => {
                scroll(document.body.scrollWidth, 0);
                document.querySelectorAll('section')[3].querySelectorAll('p')[1].style.display = 'none';
                const h6 = document.createElement('h6');

                let formattedCharacteristic = actualCharacteristic;
                if(formattedCharacteristic.includes('_')) formattedCharacteristic = formattedCharacteristic.replace('_', ' ');
                formattedCharacteristic = formattedCharacteristic.charAt(0).toUpperCase() + formattedCharacteristic.slice(1);
                h6.textContent = formattedCharacteristic;
                document.querySelectorAll('section')[3].appendChild(h6)
                document.querySelectorAll('section')[3].querySelector('.result').textContent = api[i - 2].breeds[0][actualCharacteristic];
                setTimeout(() => {
                    document.querySelector('.vs').classList.remove('unPopUp');
                    document.querySelector('.vs__aux').classList.remove('vsGood');
                    document.querySelector('.vs__aux').innerHTML = '';
                    document.querySelector('.vs').classList.add('popUp')
                    document.body.querySelectorAll('section')[2].remove();
                }, 500);
            }, 500);
        }, 1000);
    }, 1000);
}

const getApiInfo = async () => {
    fetch('https://api.thecatapi.com/v1/images/search?limit=30&has_breeds=1',
        {
            headers: {"x-api-key": "live_LpcOOa2VUTBXwXsRz3h1r3iyjibZtUVDGvyna8TkQy814hIixStPaRWwYvxf6r39"}
        }
    ).then(res => res.json())
     .then(res => {
        console.log(res);

        if(localStorage.getItem('record')) document.querySelector('.record').textContent = `High Score: ${localStorage.getItem('record')}`;
        else document.querySelector('.record').textContent = 'High Score: 0';
        document.querySelector('.start-fade').classList.add('fadeOut');


        let keys = Object.keys(res[0].breeds[0]);
        for(let i in keys){
            if(typeof res[0].breeds[0][keys[i]] == 'number') {
                characteristics.push([keys[i], res[0].breeds[0][keys[i]]])
            }
        }

        i = generateLeftPost(i, res, characteristics);
        i = generateRightPost(i, res, characteristics);

    console.log(characteristics)
    apiInfo = res;
    document.querySelector('.record').innerHTML = `High Score: ${highScore}`;
    }).catch(e => console.log(e))
}
getApiInfo()



const sectionLeftIdea = document.querySelector('section');
const sectionRightIdea = document.querySelectorAll('section')[1];
const generateLeftPost = (i, api, characteristics) =>{
    let charWord = characteristics[Math.floor(Math.random() * 22)][0];
    actualCharacteristic = charWord;

    let leftNumber;
    for(let key of Object.keys(api[i].breeds[0])){
        if(key == actualCharacteristic) leftNumber = api[i].breeds[0][key];
    }

    const section = sectionLeftIdea.cloneNode(true);
    section.removeAttribute('style')
    section.querySelector('h4 > span').textContent = api[i].breeds[0].name;
    section.querySelector('h2').textContent = leftNumber;
    section.querySelector('img').src = api[i].url;


    leftCatName = api[i].breeds[0].name;
    if(charWord.includes('_')) charWord = charWord.replace('_', ' ');
    charWord = charWord.charAt(0).toUpperCase() + charWord.slice(1);
    section.querySelector('h6').textContent = charWord;


    document.body.appendChild(section);

    i++;
    return i;
}
const generateRightPost = (i, api, characteristics) =>{
    const section = sectionRightIdea.cloneNode(true);
    section.removeAttribute('style')
    section.querySelector('h4 > span').textContent = api[i].breeds[0].name;
    section.querySelector('img').src = api[i].url;

    let formattedActualCharacteristic = actualCharacteristic;
    if(formattedActualCharacteristic.includes('_')) formattedActualCharacteristic = formattedActualCharacteristic.replace('_', ' ');
    formattedActualCharacteristic = formattedActualCharacteristic.charAt(0).toUpperCase() + formattedActualCharacteristic.slice(1);
    
    section.querySelectorAll('p')[1].querySelectorAll('span')[0].textContent = formattedActualCharacteristic;
    section.querySelectorAll('p')[1].querySelectorAll('span')[1].textContent = api[i - 1].breeds[0].name;
    

    document.body.appendChild(section);

    section.querySelector('.higher-or-lower__higher').addEventListener('click',()=>{

        let aux;
        if(i == 2) aux = 1;
        else aux = 2;

        let leftNumber;
        let resultNumber;
        console.log(actualCharacteristic,api[i-1].breeds[0].name,api[i-1].breeds[0][actualCharacteristic])
        for(let key of Object.keys(api[i - 2].breeds[0])){
            if(key == actualCharacteristic) leftNumber = api[i - 2].breeds[0][key];
        }
        
        for(let key of Object.keys(api[i - 1].breeds[0])){
            if(key == actualCharacteristic) resultNumber = api[i - 1].breeds[0][key];
        }
        //generateRightPost(i, apiInfo, characteristics)
        document.querySelectorAll('.higher-or-lower')[aux].style.display = 'none';
        document.querySelectorAll('.result')[aux].style.display = 'flex';
        document.querySelectorAll('.result')[aux].classList.add('fadeIn');
        document.querySelectorAll('.result')[aux].textContent = 0;
        
        const addIterationTime = 1000 / resultNumber;


        const intervalo = setInterval(() => {
            if(document.querySelectorAll('.result')[aux].textContent == resultNumber){
                clearInterval(intervalo);
            }else{
                document.querySelectorAll('.result')[aux].textContent = parseInt(document.querySelectorAll('.result')[aux].textContent) + 1;
            }
        }, addIterationTime);

        setTimeout(() => {
            if(resultNumber > leftNumber) {
                vsGood(i, api)
            }
            else{
                vsBad(i, api);
            }
        }, 1000);
    })

    section.querySelector('.higher-or-lower__equal').addEventListener('click',()=>{
        let aux;
        if(i == 2) aux = 1;
        else aux = 2;

        let leftNumber;
        let resultNumber;
        for(let key of Object.keys(api[i - 2].breeds[0])){
            if(key == actualCharacteristic) leftNumber = api[i - 2].breeds[0][key];
        }
        console.log(actualCharacteristic,api[i-1].breeds[0].name,api[i-1].breeds[0][actualCharacteristic])
        for(let key of Object.keys(api[i - 1].breeds[0])){
            if(key == actualCharacteristic) resultNumber = resultNumber = api[i - 1].breeds[0][key];
        }
        //generateRightPost(i, apiInfo, characteristics)
        document.querySelectorAll('.higher-or-lower')[aux].style.display = 'none';
        document.querySelectorAll('.result')[aux].style.display = 'flex';
        document.querySelectorAll('.result')[aux].classList.add('fadeIn');
        document.querySelectorAll('.result')[aux].textContent = 0;
        
        const addIterationTime = 1000 / resultNumber;

        const intervalo = setInterval(() => {
            if(document.querySelectorAll('.result')[aux].textContent == resultNumber){
                clearInterval(intervalo);
            }else{
                document.querySelectorAll('.result')[aux].textContent = parseInt(document.querySelectorAll('.result')[aux].textContent) + 1;
            }
        }, addIterationTime);

        setTimeout(() => {
            if(resultNumber == leftNumber) {
                vsGood(i, api);
            }
            else{
                vsBad(i, api);
            }
        }, 1000);
    })

    section.querySelector('.higher-or-lower__lower').addEventListener('click',()=>{
        let aux;
        if(i == 2) aux = 1;
        else aux = 2;

        let leftNumber;
        let resultNumber;
        for(let key of Object.keys(api[i - 2].breeds[0])){
            if(key == actualCharacteristic) leftNumber = api[i - 2].breeds[0][key];
        }
        console.log(actualCharacteristic,api[i-1].breeds[0].name,api[i-1].breeds[0][actualCharacteristic])
        for(let key of Object.keys(api[i - 1].breeds[0])){
            if(key == actualCharacteristic) resultNumber = resultNumber = api[i - 1].breeds[0][key];
        }
        //generateRightPost(i, apiInfo, characteristics)
        document.querySelectorAll('.higher-or-lower')[aux].style.display = 'none';
        document.querySelectorAll('.result')[aux].style.display = 'flex';
        document.querySelectorAll('.result')[aux].classList.add('fadeIn');
        document.querySelectorAll('.result')[aux].textContent = 0;
        
        const addIterationTime = 1000 / resultNumber;

        const intervalo = setInterval(() => {
            if(document.querySelectorAll('.result')[aux].textContent == resultNumber){
                clearInterval(intervalo);
            }else{
                document.querySelectorAll('.result')[aux].textContent = parseInt(document.querySelectorAll('.result')[aux].textContent) + 1;
            }
        }, addIterationTime);

        setTimeout(() => {
            if(resultNumber < leftNumber) {
                vsGood(i, api);
            }
            else{
                vsBad(i, api);
            }
        }, 1000);
    })

    i++;
    return i;
}
const showResult = (i, api, characteristics) => {

}