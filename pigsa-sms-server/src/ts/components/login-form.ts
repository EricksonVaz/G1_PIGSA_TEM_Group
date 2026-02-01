export let loginForm = `
    <form class="form-login">
        <div class="form-group">
            <label for="access">Utilizador</label>
            <input class="form-control" type="text" name="access" id="access">
            <small class="feedback-error d-none" data-error-feedback="access"></small>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input class="form-control" type="password" name="password" id="password">
            <small class="feedback-error d-none" data-error-feedback="password"></small>
        </div>
        <div class="login-options">
            <button type="submit" class="btn btn-login">Entrar</button>
            <!--<a data-href="/feedback/forgot-password" class="register-link">esqueci o password</a>-->
        </div>
    </form>
`