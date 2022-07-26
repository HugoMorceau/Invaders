
const client = require('../database/client');

const dataMapper = {
  /**
   * Cette fonction retourne toutes les promotions
   * @returns {[]} tableau de toutes les promotions
   */
  async getPromos(){
    // Préparation de la requête
    const sql = `SELECT * FROM promo`;
    // Requête
    let results = await client.query(sql);
    return results.rows;
  },
  /**
   * Retourne la promo avec l'id spécifié
   * @param {number} id 
   * @returns {Object} la promotion ou undefined si pas de promotion à l'id spécifié
   */
  async getPromoById(id){
    // Préparation de la requête
    const sql = `SELECT * FROM promo WHERE id = ${id}`;
    // Requête
    let results = await client.query(sql);
    if(results.rowCount > 0){
      return results.rows[0];
    }
    return undefined;
  },
  /**
   * Retourne tous les étudiants d'une promotion
   * @param {number} id 
   * @returns {[]} tableau des étudiants de la promotion avec l'id précisé
   */
  async getStudentsByPromo(id){
    // Préparation de la requête
    const sql = `SELECT * FROM student WHERE promo_id = ${id}`;
    // Requête
    let results = await client.query(sql);
    return results.rows;
  },
  async addStudent(studentinfos){
    console.log('addStudent du datamapper')
    const sql = `INSERT INTO student (first_name, last_name, github_username, promo_id)
    VALUES('${studentinfos.first_name}','${studentinfos.last_name}','${studentinfos.github_username}',${studentinfos.promo});`
    console.log(sql)
    let results = await client.query(sql);
    console.log(results)
  }
};

module.exports = dataMapper;