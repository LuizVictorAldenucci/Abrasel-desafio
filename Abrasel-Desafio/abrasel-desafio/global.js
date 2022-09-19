//mostrar e ocultar o formulario ou o retorno do formulario
let form = document.getElementById('form');
let button = document.getElementById('action-btn');


let section = document.getElementById('section');
let returnButton = document.getElementById('return-btn');

button.addEventListener('click', function () {
    form.classList.toggle('hide');
    section.classList.toggle('hide');

})

returnButton.addEventListener('click', function () {

    form.classList.toggle('hide');
    section.classList.toggle('hide');

})

//funcoes que executarm as regras de negocio
let address = new Object();

function calcularRendaPerCapita() {
    let rendaMensal = document.getElementById("income").value;
    let numeroDependentes = document.getElementById("dependents").value;
    let rendaPerCapita = rendaMensal / numeroDependentes;
    console.log('Renda Per Capita: ' + rendaPerCapita);
    return rendaPerCapita;
}

function checkCep() {
    let cep = document.getElementById('cep').value.replace(/\D/g, '');
    let addressObject = new Object();
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            addressObject.cep = cep;
            addressObject.logradouro = data.logradouro;
            addressObject.complemento = data.complemento;
            addressObject.bairro = data.bairro;
            addressObject.localidade = data.localidade;
            addressObject.uf = data.uf;
        });
    address = addressObject;
}

let user = new Object();

function createUser(event) {
    event.preventDefault();
    user.address = address;
    user.name = document.getElementById('name').value;
    user.perCaptaIncome = calcularRendaPerCapita();
    console.log(user);
}

//funcao para tratamento de erro no formulario
function toggleCepErrors() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (!cep) {
        //Cep é obrigatório!
        document.getElementById('cep-null-error').style.display = 'block';
    } else {
        document.getElementById('cep-null-error').style.display = 'none';
    }
}

function toggleIncomeErors() {
    const income = document.getElementById('income').value;
    if (!income) {
        //A renda é obrigatória!
        document.getElementById('income-null-error').style.display = 'block';
    } else {
        document.getElementById('income-null-error').style.display = 'none';
    }

    if (income <= 0) {
        //A renda deve ser um valor maior que zero!
        document.getElementById('income-invalid-error').style.display = 'block';
    } else {
        document.getElementById('income-invalid-error').style.display = 'none';
    }
}

function toggleDependentsErrors() {
    const dependents = document.getElementById('dependents').value;
    if (!dependents) {
        //O número de dependentes é obrigatório!
        document.getElementById('dependents-null-error').style.display = 'block';
    } else {
        document.getElementById('dependents-null-error').style.display = 'none';
    }

    if (dependents <= 0) {
        //O número de dependentes deve ser um valor maior que zero!
        document.getElementById('dependents-invalid-error').style.display = 'block';
    } else {
        document.getElementById('dependents-invalid-error').style.display = 'none';
    }
}

function onBlurCep() {
    toggleButtonsDisable();
    checkCep();
    toggleCepErrors();
}

function onBlurIncome() {
    toggleButtonsDisable();
    toggleIncomeErors();
}

function onBlurDependents() {
    toggleButtonsDisable();
    toggleDependentsErrors();
}

function isIncomeValid() {
    const income = document.getElementById('income').value;
    if (income > 0) {
        return true;
    }
}

function isDependentsValid() {
    const dependents = document.getElementById('dependents').value;
    if (dependents > 0) {
        return true;
    }
}

function toggleButtonsDisable() {
    let cepValid = document.getElementById('cep').value;
    let incomeValid = isIncomeValid();
    let dependentsValid = isDependentsValid();
    document.getElementById('action-btn').disabled = !cepValid || !incomeValid || !dependentsValid;
}

function printResult(event) {
    createUser(event);
    var nameArea = document.getElementById("name-area");
    var addressArea = document.getElementById("address-area");
    var perCaptaIncome = document.getElementById("per-capita-income");
    if (user.name == '' || user.name.replace(/ /g, "") == '')
        nameArea.innerText = 'Nome não informado.';
    else
        nameArea.innerText = user.name;

    if (user.address.logradouro == null)
        addressArea.innerText = 'Não conseguimos encontrar seu endereço a partir do cep dado.';
    else
        addressArea.innerText = user.address.logradouro + ', ' + user.address.bairro + ', ' + user.address.localidade + ' - ' + user.address.uf + '. ' + user.address.cep;

    perCaptaIncome.innerText = 'R$' + user.perCaptaIncome;
}