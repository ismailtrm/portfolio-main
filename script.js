// Sahne, Kamera, Renderer Oluşturma
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Antialiasing eklendi
renderer.setSize(window.innerWidth, 300);
document.getElementById('donut-container').appendChild(renderer.domElement);

// Donut Geometrisi ve Texture
const geometry = new THREE.TorusGeometry(10, 4, 16, 100);
const textureLoader = new THREE.TextureLoader();
const donutTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/uv_grid_opengl.jpg');

// Donut Malzemesi (MeshStandardMaterial)
const material = new THREE.MeshStandardMaterial({
    map: donutTexture,
    metalness: 0.5, // Metalliklik (0-1 arası)
    roughness: 0.4,  // Pürüzlülük (0-1 arası)
});

// Donut Nesnesi
const donut = new THREE.Mesh(geometry, material);
scene.add(donut);

// Kamera Pozisyonu
camera.position.z = 35; // Kamerayı donuttan biraz uzaklaştırdım

// Işık Ekleme 
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Ortam ışığı (daha yumuşak)
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.9); // Noktasal ışık, donutun önünde
pointLight.position.set(5, 10, 25); // Işık pozisyonu
scene.add(pointLight);

const skyGeometry = new THREE.SphereGeometry(99, 32, 1); // Büyük bir küre

// Arka plan için fragment shader
const skyFragmentShader = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  varying vec2 vUv;

  void main() {
    vec3 color = mix(bottomColor, topColor, vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Arka plan için uniform'lar
const skyUniforms = {
  topColor: { value: new THREE.Color(0x040061) }, // Üst renk (açık mavi)
  bottomColor: { value: new THREE.Color(0x000000) } // Alt renk (beyaz)
};

// Arka plan materyali
const skyMaterial = new THREE.ShaderMaterial({
  uniforms: skyUniforms,
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: skyFragmentShader,
  side: THREE.BackSide // Kürenin içini render etmek için
});

// Arka plan nesnesi
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);
// Animasyon Döngüsü
function animate() {
    requestAnimationFrame(animate);
    donut.rotation.y += 0.01; // Y ekseni etrafında dönme
    renderer.render(scene, camera);
}
animate();

// Pencere Boyutu Değişimi (optimize edildi)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 300);
});
// Sekme İşlevselliği
const tabs = document.querySelectorAll('.tab');
const tabPanes = document.querySelectorAll('.tab-pane');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});
