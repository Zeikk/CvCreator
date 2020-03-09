import retranscription from '../pages/control/traitement'

//Tests champ Telephone

describe('Regex Telephone', () => {

        it('EcritureTelephone - Espacement', () => {

            expect(retranscription("0642949285", "tel", "064294928")).toBe("06 42 94 92 85 ");

        });

        it('EcritureTelephone - caractères Intermédiaire', () => {

            expect(retranscription("045", "tel", "04")).toBe("04 5");

        });

        it('EcritureTelephone - Suppression Espaces', () => {

            expect(retranscription("5        458", "tel", "5        45")).toBe("5 45 8");

        });

        it('EcritureTelephone - Plus de 14 caractères', () => {

            expect(retranscription("04 55 45 65 84 5", "tel", "04 55 45 65 84 ")).toBe("04 55 45 65 84 ");

        });

        it('EcritureTelephone - Plus de 15 caractères', () => {

            expect(retranscription("4 55 45 65 84 5", "tel", "4 55 45 65 84 ")).toBe("4 55 45 65 84 ");

        });

        it('EcritureTelephone - Remise à zèro', () => {

            expect(retranscription("", "tel", "4")).toBe("");

        });

        it('EcritureTelephone - TestRegex', () => {

            expect(retranscription("a", "tel", "")).toBe("");

        })

        it('EcritureTelephone - TestRegex2', () => {

            expect(retranscription("02 56z", "tel", "02 56")).toBe("02 56");

        })

})

//Tests champ Code Postal

describe('Regex Code Postal', () => {

        it('EcritureCodePostal - Suppression Espaces', () => {

            expect(retranscription("023             4", "postal", "023             4 ")).toBe("0234");

        })

        

        it('EcritureCodePostal - Remise à zèro', () => {

            expect(retranscription("", "postal", "1")).toBe("");

        })

        

        it('EcritureCodePostal - PLus de 6 caractères', () => {

            expect(retranscription("141235", "postal", "14123")).toBe("14123");

        })

        

        it('EcritureCodePostal - TestRegex', () => {

            expect(retranscription("14r", "postal", "14")).toBe("14");

        })

})

//Tests champ Nom

describe('Regex Nom', () => {

        it('EcritureNom - Suppression Espaces', () => {

            expect(retranscription("LE            CORFF", "nom", "LE            CORF")).toBe("LE CORFF");

        })

        it('EcritureNom - Remise à zèro', () => {

            expect(retranscription("", "nom", "L")).toBe("");

        })

        it('EcritureNom - Plus de 40 caractères', () => {

            expect(retranscription("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbcd", "nom", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbc")).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbc");

        })

        it('EcritureNom - Accent', () => {

            expect(retranscription("Loïck", "prenom", "Loïc")).toBe("Loïck");

        })

        it('EcritureNom - TestRegex', () => {

            expect(retranscription("Pie1", "nom", "Pie")).toBe("Pie");

        })

})