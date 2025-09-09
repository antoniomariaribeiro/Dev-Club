let p = document.querySelector("p");
let input = document.querySelector("input");

const contacts = [
    { name: 'Rodolfo', number: '(19) 94343-3434' },
    { name: 'Paulo', number: '(19) 94343-3434' },
    { name: 'Aline', number: '(19) 94343-3434' },
    { name: 'Maria', number: '(19) 94343-3434' },
    { name: 'Antonio', number: '(19) 94343-3476' }
];

function searchContact() {
    for (let i = 0; i < contacts.length; i++) {
        
        if(input.value.toLowerCase() === contacts[i].name.toLowerCase()) {
            p.innerHTML = `Contato encontrado nome:${contacts[i].name} Tel: ${contacts[i].number}`;

            break
        } else {
            p.innerHTML = 'Contato não encontrado'
        }
    }
    
} 



  /*  if (contacts[i].name.toLowerCase() === input.value.toLowerCase()) {
            p.innerHTML = `O número de ${contacts[i].name} é ${contacts[i].number}`;
            return;
        } */