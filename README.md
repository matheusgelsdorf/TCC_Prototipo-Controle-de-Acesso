
### Introdução
Este projeto foi desenvolvido com a intenção de elaborar um protótipo de um sistema de venda e uso de tíquetes eletrônicos para a automatização do acesso ao Restaurante Universitário da UFPEL. No projeto foi desenvolvido uma SPA em Vue.Js, uma camada de Hardware para realizar o controle de acesso e uma API construída com Node.Js.
Para persistir os dados foi utilizado o banco relacional PostGreSQL e o banco de dados NoSQL MongoDB.

---
---

### Algumas das tecnologias utilizadas
#### Backend
* Node.Js.
* Express.Js.
* Passport.
* Bcrypt.
* PostgreSQL.
* Knex.Js.
* MongoDB.
* Mongoose.
#### Frontend
* Vue.Js.
* Bootstrap Vue.
* Vuex.
* Vue Toasted.
* Axios.

---
---

### Como testar?
#### 1. Após clonar o projeto para o seu computador, entre na pasta `/backend` pelo terminal e digite:
`npm i`
para instalar as dependências do backend.

#### 2. Pelo terminal entre na pasta `/frontend` e digite:
`npm i`
para instalar as dependências do frontend.

#### 3. Após instalar as dependências entre na pasta `/backend` pelo terminal. Então atualize o arquivo `knexfile.js` colocando o seu usuário e senha do PostGreSQL nos campos de _user_ e _password_ respectivamente.
* OBS: No arquivo .env o _authSecret_ que pode ser alterado para o segredo de sua preferência.

#### 4. Para iniciar o servidor entre dentro da pasta `/backend` através do terminal e digite:
`npm start`
O servidor é executado na porta 3000.

#### 5. Para iniciar a SPA entre dentro da pasta `/frontend` através do terminal digite:
`npm run serve`.
O frontend é executado na porta 8080.

#### 6. Em um primeiro momento não há nenhum Usuário, Operador e Dispositivo cadastrado, então é necessário realizar o login como Administrador e cadastrar cada um dos elementos. Para realizar o login como um Administrador basta inserir os dados abaixo:
* CPF: 777
* Senha: 12345
* Marcar **"Operador"**.

#### 7. Após realizar login como admin basta registrar Usuários, Operadores, Dispositivos e Administradores. Por meio desses elementos cadastrados podem ser feitos os testes necessários.

---
---

### Documentação das URI's

#### 1. `/signin`
*  **POST** - Utilizado para realizar o login. Retorna um JWT (JSON Web Token).
##### Não requer autenticação.

#### 2. `/validateToken`
*  **POST** - Utilizado pelo frontend para validar um JWT. Retorna true ou false.
##### Não requer autenticação.

#### 3. `/signinDevice`
*  **POST** - Utilizado por uma unidade de Hardware para se autenticar. Retorna um JWT.
##### Não requer autenticação.

#### 4. `/users`
*  **POST** - Cadastra usuário.
*  **GET** - Retorna todos os usuários.
*  **PUT** - Atualiza dados de um usuário.
*  **DELETE** - Realiza uma operação de **soft delete** em um usuário.
##### Requer autenticação. Nível de acesso de _Administrador_.

#### 5. `/users/tickets`
*  **GET** - Retorna os tíquetes não utilizados de um usuário.
##### Requer autenticação. Nível de acesso de _Usuário_.

#### 6. `/users/:registrationNumber`
*  **GET** - Retorna o usuário que corresponde com um determinado número de matricula ou numero SIIAPE.
##### Requer autenticação. Nível de acesso de _Operador_.

#### 7. `/tickets`
**POST** - Registra a venda de um conjunto de tíquetes de refeição para um usuário.
##### Requer autenticação. Nível de acesso de _Operador_.

#### 8. `/operators`
*  **POST** - Cadastra operador.
*  **GET** - Retorna todos os operadores.
*  **PUT** - Atualiza dados de um operador.
*  **DELETE** - Realiza uma operação de __soft delete__ em um operador.
##### Requer autenticação. Nivel de acesso de _Administrador_.

#### 9. `/device`
*  **POST** - Cadastra dispositivo de Hardware.
*  **GET** - Retorna todos os dispositivos.
*  **PUT** - Atualiza dados de um dispositivo.
*  **DELETE** - Realiza uma operação de __soft delete__ em um dispositivo.
##### Requer autenticação. Nivel de acesso de _Administrador_.

#### 10. `/device/useTicket`
*  **POST** - Registra o uso de um tíquete de refeição.
##### Requer autenticação. Nivel de acesso de _Dispositivo_.

#### 11. `/device/getLocations`
*  **GET** - Utilizado pelo frontend. Retorna as unidades de restaurantes universitários existentes.
##### Requer autenticação. Nível de acesso de _Administrador_.
