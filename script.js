 function transformText(direction) {
            let text = document.getElementById("text").value;
            let key = Number(document.getElementById("key").value);

            if (document.getElementById("key").value.trim() === "" || !Number.isInteger(key)) {
                document.getElementById("result").innerText = "Please enter a whole-number key.";
                return;
            }

            let result = "";

            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i)+6*direction);
            }

            document.getElementById("result").innerText = result;
        }
           function encrypt() {
            transformText(1);
        }

        function decrypt() {
            transformText(-1);
        }