const { createApp, ref, reactive, onMounted, toRaw, watch, computed } = Vue;

const app = createApp({
    delimiters: ['${', '}$'],

    setup() {
        
        const tableId = ref('');    
        const mesas = ref([]);

        const form = reactive({                   
            dados: null,
            players: [],
            mqtt: {
                client: null,
                broker: "wss://slock.com.br:1884", // Corrigido para WebSockets
                options:{
                    username: 'AUTEN_SLOCKER',
                    password: 'AUTEN_slocker@20052022',
                },                
                topicos: {
                    send: 'iapoker/client/to/broker',
                    receiver: 'iapoker/broker/to/client'
                }
            },
        })        

        const dom = reactive({
            btn_fold: false,
            btn_check: false,
            btn_call: false,
            raise: false,
            btn_allin: false,
            input_bet: false,
            img_hidden_card: null,
            img_poker_table_1: null,
            img_poker_table_2: null,
            img_poker_table_3: null,
        })

        onMounted(() => {    
            
            form.dados = JSON.parse($('#dados').val())
            dom.img_hidden_card = $('#hidden_cards').val()
            dom.img_poker_table_1 = $('#img_background_1').val()
            dom.img_poker_table_2 = $('#img_background_2').val()
            dom.img_poker_table_3 = $('#img_background_3').val()

            form.mqtt.client = mqtt.connect(form.mqtt.broker, form.mqtt.options);

            form.mqtt.client.on("connect", () => {
                console.log("Conectado ao MQTT!");                        
                form.mqtt.client.subscribe(form.mqtt.topicos.receiver);
            });

            form.mqtt.client.on("message", (topic, message) => {                        
                let json = JSON.parse(message.toString())
                
                console.log(json)                

            });

            form.mqtt.client.on("error", (err) => {
                console.error("Erro MQTT:", err);
            });

            form.mqtt.client.on("close", () => {
                console.log("Desconectado do MQTT!");                        
            });

            getPlayers(() => {
                
                let quantidade_players = form.players.length - 1
                let img = dom.img_poker_table_1

                if(quantidade_players == 2){
                    img = dom.img_poker_table_2   
                }else if(quantidade_players == 3){
                    img = dom.img_poker_table_3
                }

                $('.mesa').css({
                    'position': 'relative',
                    'width': 'auto',
                    'height': '800px',
                    'background-image': `url('${img}')`,
                    'background-size': 'cover',
                    'background-position': 'center',
                    'margin': 'auto',
                    'border-radius': '16px',
                    'max-width': '100%',
                    'aspect-ratio': '5 / 3',
                    'background-size': 'contain',
                    'background-repeat': 'no-repeat'
                });

            })
            
        })

        const sendMessageMqtt = (msg) => {                        

            if (msg && form.mqtt.client.connected) {
                form.mqtt.client.publish(form.mqtt.topicos.send, msg);
                console.log("Mensagem enviada:", msg);
            } else {
                alert("Erro: MQTT desconectado ou mensagem vazia.");
            }

        } 

        const getPlayers = async (callback) => {        
            try {
                
                let url = `${form.dados.ENDPOINT_API}${form.dados.endpoints.table_players}`
                
                const headers = new Headers();
                headers.append("Authorization", form.dados.hash_system); 
                headers.append("Content-Type", "application/json");           
                
                const raw = JSON.stringify({
                    'table_id': 1
                })

                const requestOptions = {
                    method: "POST",
                    headers: headers,
                    body: raw,
                    redirect: "follow"
                };                

                const response = await fetch(url, requestOptions);
                const result = await response.json(); // <- aqui é o pulo do gato
                console.log('🔁 Resultado da API:', result);
                form.players = result

                callback()

            } catch (error) {
                console.error('Erro ao buscar players:', error);
                mesas.value = null;
            }
        };       
        
        // Expor para o console (F12)
        window.form = form

        return {
            tableId,    
            dom                                      
        };
    }
});

app.mount('#app');
