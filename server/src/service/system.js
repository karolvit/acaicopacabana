const pool = require('../database/connection');

async function getcaixa(userno) {
    try {
        const query = `select s0 from cxlog where s0 = 0 and date = current_date() - interval 1 day and userno = ?`;
        const values = [userno]
        const [results] = await pool.query(query, values);

        if (results.length === 0) {
            return { success: true, message: "Não foi encontrado nenhum produto com esse nome" };
        } else {
            return { success: true, message: results };
        }
    } catch (error) {
        return { success: false, error: "Erro no servidor, por favor contatar o administrador", details: error };
    }
}

async function saldo(userno) {
    try {
        const query = `
SELECT sd FROM cxlog WHERE s0 = 0 AND date = CURRENT_DATE() - INTERVAL 1 DAY where userno = ? `;
        const values = [userno]
        const [results] = await pool.query(query, values);

        if (results.length === 0) {
            return { success: true, message: "Não foi encontrado nenhum produto com esse nome" };
        } else {
            return { success: true, message: results };
        }
    } catch (error) {
        return { success: false, error: "Erro no servidor, por favor contatar o administrador", details: error };
    }
}

async function abrirCaixa(s0, sd, userno) {
    try {

        const query = `INSERT INTO cxlog (s0, sd, date, time, userno) VALUES (? ,?, CURRENT_DATE(), CURRENT_TIME(), ?)`;
        const values = [s0, sd, userno];

        await pool.query(query, values);
        return { success: true, message: "Caixa aberto" };
    } catch (error) {
        return { success: false, error: "Erro ao abrir caixa", details: error };
    }
}

async function fechamento(usuarioId) {
    try {
        const buscaUsuarioQuery = `
            SELECT pedno.userno
            FROM usuario
            INNER JOIN pedno
            ON pedno.userno = usuario.nome
            WHERE usuario.id = ? 
        `;

        const [buscaUsuarioResult] = await pool.query(buscaUsuarioQuery, [usuarioId]);
        if (buscaUsuarioResult.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const userno = buscaUsuarioResult[0].userno;

        const saldoQuery = `
            SELECT 
                COALESCE(
                    (SELECT SUM(sd) FROM cxlog WHERE s0 = 0 AND date = CURRENT_DATE - INTERVAL 1 DAY), 0
                ) +
                COALESCE(
                    (SELECT SUM(valor_unit) FROM pedno WHERE data_fechamento = CURRENT_DATE() AND userno = ?), 0
                ) AS saldo_fechamento
        `;

        const [saldoResult] = await pool.query(saldoQuery, [userno]);
        const saldo_fechamento = saldoResult[0].saldo_fechamento;

        const insertQuery = `
            INSERT INTO cxlog (s0, sd, date, time, userno)
            VALUES (
                0, 
                ?,
                CURRENT_DATE, 
                CURRENT_TIME,
                ?
            )
        `;

        await pool.query(insertQuery, [saldo_fechamento, userno]);

        return { success: true, message: ['Caixa Fechado com Sucesso'] };
    } catch (error) {
        return { success: false, message: ['Erro ao fechar caixa', error.message] };
    }
}

module.exports = {
    getcaixa,
    saldo,
    abrirCaixa,
    fechamento
}