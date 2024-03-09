openapi: 3.0.0
info:
  title: Sistema de Estoque API
  version: 1.0.0
paths:
  /estoque:
    post:
      summary: Adicionar produto ao estoque
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                nome:
                  type: string
                categoria:
                  type: string
                data_compra:
                  type: string
                  format: date
                data_validade:
                  type: string
                  format: date
                quantidade:
                  type: integer
                valor_compra:
                  type: number
      responses:
        '200':
          description: Produto inserido com sucesso
        '500':
          description: Erro ao inserir produto no estoque
    get:
      summary: Obter todos os produtos no estoque
      responses:
        '200':
          description: Lista de produtos no estoque
        '401':
          description: Licença expirada

  /produto:
    post:
      summary: Adicionar produto
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                nome:
                  type: string
                categoria:
                  type: string
                codigo_produto:
                  type: string
                codigo_personalizado:
                  type: string
                preco_custo:
                  type: number
                tipo:
                  type: string
                quantidade:
                  type: integer
                data_venda:
                  type: string
                  format: date
                img_produto:
                  type: string
      responses:
        '201':
          description: Produto cadastrado com sucesso
        '400':
          description: Erro ao cadastrar produto

    get:
      summary: Obter todos os produtos
      responses:
        '200':
          description: Lista de todos os produtos
        '404':
          description: Não existe produtos cadastrados

  /user:
    post:
      summary: Cadastrar novo usuário
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                nome:
                  type: string
                usuario:
                  type: string
                senha:
                  type: string
                cargo:
                  type: string
      responses:
        '201':
          description: Usuário cadastrado com sucesso
        '500':
          description: Erro ao cadastrar usuário

  /login:
    post:
      summary: Autenticar usuário
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                usuario:
                  type: string
                senha:
                  type: string
      responses:
        '200':
          description: Autenticação bem-sucedida
        '401':
          description: Falha na autenticação
        '500':
          description: Erro no Banco de Dados

  /ped:
    post:
      summary: Enviar pedido
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                pedido:
                  type: object
                  properties:
                    produtos:
                      type: array
                      items:
                        type: object
                        properties:
                          pedido:
                            type: integer
                          prodno:
                            type: integer
                          valor_unit:
                            type: number
                          unino:
                            type: integer
                          sta:
                            type: integer
                          userno:
                            type: integer
      responses:
        '200':
          description: Pedido inserido com sucesso
        '400':
          description: Formato de pedido inválido
        '500':
          description: Erro ao inserir produto no banco de dados
        '401':
          description: Erro ao obter conexão do pool ou iniciar transação