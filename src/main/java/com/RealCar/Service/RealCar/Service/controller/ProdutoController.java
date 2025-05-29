package com.RealCar.Service.RealCar.Service.controller;

import com.RealCar.Service.RealCar.Service.Model.ProdutoModel;
import com.RealCar.Service.RealCar.Service.Service.Produto;
import com.RealCar.Service.RealCar.Service.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/produtos")
@CrossOrigin("*") // Permite chamadas do frontend
public class ProdutoController {


    @Autowired
    private final ProdutoRepository repository;

    public ProdutoController(ProdutoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Produto> listarTodos() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    @PostMapping
    public Produto criar(@RequestBody Produto produto) {

        return repository.save(produto);
    }

    @PutMapping("/{id}")
    public Produto atualizar(@PathVariable Long id, @RequestBody Produto produto) {
        Produto existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        existente.setNome(produto.getNome());
        existente.setPreco(produto.getPreco());
        existente.setQuantidade(produto.getQuantidade());

        return repository.save(existente);
    }

    @RequestMapping("/produtos")
    public ProdutoModel listaEventos(){
        ProdutoModel pm = new ProdutoModel("listaProdutos");
        Iterable<Produto> produtos = repository.findAll();
        pm.addObject("produtos", produtos);
        return pm;
    }


    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
