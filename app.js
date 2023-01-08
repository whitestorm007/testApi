var pathToFfmpeg = require('ffprobe-static');
const { execFile } = require('child_process')
const app = require("express")();


/**
 * Executes ffprobe with provided arguments
 * @func    ffprobeExecFile
 * @param   {String}        path Path of the ffprobe binary
 * @param   {Array<String>} args Array of arguments passed to ffprobe
 * @returns {Promise<Object>}    Promise that resolves to the ffprobe JSON output
 */
function ffprobeExecFile(path, args) {

    return new Promise((resolve, reject) => {
        execFile(path, args, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                if (err.code === 'ENOENT') {
                    reject(err)
                } else {
                    const ffprobeErr = new Error(stderr.split('\n').pop())
                    console.log(ffprobeErr);
                    reject(ffprobeErr)
                }
            } else {
                resolve(JSON.parse(stdout))
            }
        })
    })
}

/**
 * Analyzes a video with ffprobe
 * @func    ffprobe
 * @param   {String} target   The file path or remote URL of the video
 * @param   {Object} [config={}]             A configuration object
 * @param   {String} [config.path='ffprobe'] Path of the ffprobe binary
 * @returns {Promise<Object>} Promise that resolves to the ffprobe JSON output
 */

function ffprobe(target, config = {}) {
    const path = pathToFfmpeg.path //"./ffprobe/ffprobe"
    const args = [
        '-show_streams',
        '-show_format',
        '-print_format',
        'json',
        target
    ]


    return ffprobeExecFile(path, args)
}


console.log(pathToFfmpeg);


app.get("/", (req, res) => {
    res.send("hii jeet")
});
app.get("/run", async (req, res) => {
    res.send(await ffprobe("https://seach.sigmacdn1.workers.dev/stream/782167627762213921326932754d4e52605250363664523b697b67733353506a347231424c574a625a75212f21776a6e6621393235343032363a3631373235367e/Money%20Heist%20S01-%20Episode%2001.mkv"))
});
app.listen(process.env.PORT || 5000)