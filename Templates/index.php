<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$usuarioLogado = isset($_SESSION['user_id']);
?>

<?php if ($usuarioLogado): ?>
    <?php include 'header.php'; ?>
<?php else: ?>
    <?php include 'header2.php'; ?>
<?php endif; ?>

<!-- LAYER 2, 3, 4, 5 CONTAINER -->
<main class="flex-1 container mx-auto p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 ">

</main>

<?php include 'footer.php'; ?>