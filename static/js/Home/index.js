const { createApp, ref, reactive, onMounted, toRaw, watch, computed } = Vue;

const app = createApp({
    delimiters: ['${', '}$'],

    setup() {
        
        const tableId = ref('');    
        const mesas = ref([]);

        const form = reactive({                   
            dados: null,
            player: {                
                secret_key: "90da9aaf85704890bb7a14f0d2b6c0f0",
                data: null                
            },            
        })        

        onMounted(() => {
            form.dados = JSON.parse($('#dados').val())
            listarMesas()
            
        })

        const listarMesas = async () => {        
            try {

                let url = form.dados.ENDPOINT_API + form.dados.endpoints.list_table

                const headers = new Headers();
                headers.append("Authorization", form.dados.hash_system);            
                
                const requestOptions = {
                    method: "GET",
                    headers: headers,
                    body: null,
                    redirect: "follow"
                };                

                const response = await fetch(url, requestOptions);
                const result = await response.json(); // <- aqui é o pulo do gato
                console.log('🔁 Resultado da API:', result.mesas);
                mesas.value = result.mesas; // <- agora sim

            } catch (error) {
                console.error('Erro ao buscar mesa:', error);
                mesas.value = null;
            }
        };       
        
        const entrar = async (mesa) => {
            try {

                let url = form.dados.ENDPOINT_API + form.dados.endpoints.join_table

                const headers = new Headers();
                headers.append("Authorization", form.dados.hash_system);            
                
                const requestOptions = {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        "table_id": mesa.id,
                        "secret_key": form.player.secret_key
                    }),
                    redirect: "follow"
                };

                console.table(requestOptions)

                const response = await fetch(url, requestOptions);
                const result = await response.json(); // <- aqui é o pulo do gato
                console.log('🔁 Resultado da API:', result);                
                form.player.data = result

            } catch (error) {
                console.error('Erro ao buscar mesa:', error);
                form.player.data = null;
            }
        }

        // Expor para o console (F12)
        window.form = form
        window.mesas = mesas

        return {
            tableId,      
            mesas,
            entrar
        };
    }
});

app.mount('#app');
